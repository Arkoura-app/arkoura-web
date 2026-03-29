'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

export default function VerifiedContent() {
  const [status, setStatus] = useState<'loading' | 'verified' | 'not_verified'>('loading')

  useEffect(() => {
    async function check() {
      // auth can be null during SSR — guard here
      if (!auth) {
        setStatus('not_verified')
        return
      }
      const user = auth.currentUser
      if (!user) {
        // User might need to sign in first
        setStatus('not_verified')
        return
      }
      await user.reload()
      setStatus(user.emailVerified ? 'verified' : 'not_verified')
    }
    check()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <div className="w-8 h-8 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin mx-auto" />
        )}
        {status === 'verified' && (
          <>
            <div className="w-16 h-16 bg-[#E8F2E6] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#4A7A50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 16l8 8L26 8"/>
              </svg>
            </div>
            <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] mb-3">
              Email verified ✓
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Your Arkoura account is fully activated.
              Start building your health profile.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
            >
              Go to my dashboard
            </a>
          </>
        )}
        {status === 'not_verified' && (
          <>
            <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] mb-3">
              Almost there
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              Please sign in and click the verification
              link in your email to activate your account.
            </p>
            <a
              href="/signin"
              className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
            >
              Sign in
            </a>
          </>
        )}
      </div>
    </div>
  )
}
