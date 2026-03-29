import { auth } from '@/lib/firebase'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

export async function cfFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const currentUser = auth?.currentUser
  if (!currentUser) throw new Error('Not authenticated')
  const token = await currentUser.getIdToken()
  const existingHeaders = (options.headers ?? {}) as Record<string, string>
  return fetch(`${CF_FUNCTIONS_BASE}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...existingHeaders,
    },
  })
}
