export const runtime = 'edge'

import { Resend } from 'resend'

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`

async function getFirestoreToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      iss: process.env.FIREBASE_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  )

  const privateKey = process.env.FIREBASE_PRIVATE_KEY!
    .replace(/\\n/g, '\n')
    .replace('-----BEGIN PRIVATE KEY-----\n', '')
    .replace('\n-----END PRIVATE KEY-----\n', '')
    .replace(/\n/g, '')

  const keyData = Uint8Array.from(atob(privateKey), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signingInput = `${header}.${payload}`
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  )

  const jwt = `${signingInput}.${btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })

  const tokenData = (await tokenRes.json()) as { access_token: string }
  return tokenData.access_token
}

async function checkDuplicate(email: string, token: string): Promise<boolean> {
  const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'waitlist' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'email' },
            op: 'EQUAL',
            value: { stringValue: email },
          },
        },
        limit: 1,
      },
    }),
  })
  const data = (await res.json()) as Array<{ document?: unknown }>
  return Array.isArray(data) && data.length > 0 && !!data[0].document
}

async function writeWaitlist(email: string, name: string, token: string): Promise<void> {
  await fetch(`${FIRESTORE_BASE}/waitlist`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        email: { stringValue: email },
        name: { stringValue: name },
        source: { stringValue: 'landing' },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  })
}

// In-memory rate limiting (edge compatible)
const ipTimestamps = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  const times = (ipTimestamps.get(ip) ?? []).filter((t) => t > oneHourAgo)
  if (times.length >= 5) return true
  ipTimestamps.set(ip, [...times, now])
  return false
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; name?: string }
    const email = body.email?.trim().toLowerCase()
    const name = body.name?.trim() ?? ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'invalid_email' }, { status: 400 })
    }

    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for') ??
      'unknown'

    if (checkRateLimit(ip)) {
      return Response.json({ error: 'rate_limited' }, { status: 429 })
    }

    const token = await getFirestoreToken()

    const isDuplicate = await checkDuplicate(email, token)
    if (isDuplicate) {
      return Response.json({ ok: true })
    }

    await writeWaitlist(email, name, token)

    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({
      from: 'Arkoura <hello@arkoura.com>',
      to: email,
      subject: "You're on the Arkoura waitlist 🌿",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;padding:40px 32px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;">🌿</span>
            <h1 style="font-family:Georgia,serif;font-size:28px;color:#1C2B1E;margin:8px 0 0;">Arkoura</h1>
          </div>
          ${name ? `<p style="color:#374151;font-size:16px;">Hi ${name},</p>` : ''}
          <h2 style="font-family:Georgia,serif;font-size:24px;color:#1C2B1E;margin:0 0 16px;">
            You're on the list.
          </h2>
          <p style="color:#6B7280;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Thank you for joining the Arkoura waitlist. We're building something
            that matters — a personal health journal that becomes an emergency lifeline.
          </p>
          <div style="background:#F4F6F2;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
            <p style="color:#1C2B1E;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.08em;">What to expect</p>
            <div style="display:flex;align-items:center;margin-bottom:8px;">
              <span style="color:#4A7A50;margin-right:8px;">✓</span>
              <span style="color:#374151;font-size:14px;">Free emergency QR profile — forever</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:8px;">
              <span style="color:#4A7A50;margin-right:8px;">✓</span>
              <span style="color:#374151;font-size:14px;">Works in 20 languages</span>
            </div>
            <div style="display:flex;align-items:center;">
              <span style="color:#4A7A50;margin-right:8px;">✓</span>
              <span style="color:#374151;font-size:14px;">Your data, your control</span>
            </div>
          </div>
          <div style="text-align:center;margin-bottom:32px;">
            <a href="https://arkoura.com"
               style="background:#4A7A50;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;display:inline-block;">
              Learn more at arkoura.com
            </a>
          </div>
          <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
            © 2026 Arkoura. Engineered for humanity.<br/>
            You're receiving this because you joined the Arkoura waitlist.
          </p>
        </div>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return Response.json({ error: 'server_error' }, { status: 500 })
  }
}
