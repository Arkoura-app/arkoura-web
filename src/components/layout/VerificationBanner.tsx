'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

export function VerificationBanner() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const user = auth?.currentUser
  if (!user || user.emailVerified || dismissed) return null

  async function resend() {
    if (sending || sent || !user) return
    setSending(true)
    try {
      const token = await user.getIdToken()
      const base = CF_FUNCTIONS_BASE
      await fetch(`${base}/sendVerificationEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      setSent(true)
    } catch {
      setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-amber-50 border-b border-amber-100">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-amber-500">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
        </div>
        <p className="flex-1 text-sm text-amber-800">
          <span className="font-medium">Verify your email</span>
          {' '}— check your inbox for the verification link we sent you.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          {sent ? (
            <span className="text-xs text-green-600 font-medium">
              ✓ Email resent
            </span>
          ) : (
            <button
              onClick={resend}
              disabled={sending}
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Resend email'}
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
