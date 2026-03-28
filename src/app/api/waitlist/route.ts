// Firebase Admin SDK requires Node.js runtime
export const runtime = 'nodejs'

import { createElement } from 'react'
import { Resend } from 'resend'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/firebase-admin'
import WaitlistConfirmation from '@/emails/WaitlistConfirmation'
import { render } from '@react-email/render'

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

const ipTimestamps = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  const times = (ipTimestamps.get(ip) ?? [])
    .filter((t) => t > oneHourAgo)
  if (times.length >= 5) return true
  ipTimestamps.set(ip, [...times, now])
  return false
}

export async function POST(request: Request) {
  // 1. Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'validation_failed' }, { status: 400 })
  }

  // 2. Zod validation
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'validation_failed' }, { status: 400 })
  }

  const { email, name } = parsed.data

  const db = getAdminDb()
  const resend = getResendClient()

  // 3. Rate limiting — max 5 signups per IP per hour
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip)) {
    return Response.json(
      { error: 'rate_limited' },
      { status: 429 }
    )
  }

  // 4. Duplicate check
  const dupSnap = await db
    .collection('waitlist')
    .where('email', '==', email)
    .limit(1)
    .get()

  if (!dupSnap.empty) {
    return Response.json({ error: 'already_registered' }, { status: 400 })
  }

  // 5. Write to Firestore
  await db.collection('waitlist').add({
    email,
    name: name ?? null,
    createdAt: FieldValue.serverTimestamp(),
    source: 'landing',
    ip,
  })

  // 6. Send confirmation email via Resend
  const html = await render(createElement(WaitlistConfirmation, { name }))
  await resend.emails.send({
    from: 'Arkoura <hello@arkoura.com>',
    to: email,
    subject: "You're on the Arkoura waitlist 🌿",
    html,
  })

  return Response.json({ ok: true })
}
