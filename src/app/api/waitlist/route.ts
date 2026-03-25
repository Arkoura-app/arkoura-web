export const runtime = 'edge'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'validation_failed' }, { status: 400 })
  }

  const { name, email } = body as { name?: string; email?: string }

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return Response.json({ error: 'validation_failed' }, { status: 400 })
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return Response.json({ error: 'validation_failed' }, { status: 400 })
  }

  console.log('[waitlist]', { name: name.trim(), email: email.trim() })

  return Response.json({ ok: true })
}
