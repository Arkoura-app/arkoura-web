'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

export interface ProfileData {
  user: Record<string, unknown>
  profile: {
    firstName?: string
    lastName?: string
    preferredName?: string
    dateOfBirth?: string
    biologicalSex?: string
    bloodType?: string
    primaryLanguage?: string
    organDonor?: boolean
    profilePhotoRef?: string
    profilePhotoUrl?: string
    activeQrToken?: string
    qrEnabled?: boolean
    quickGlanceIcons?: string[]
    onboardingComplete?: boolean
  }
  qrToken: string
  qrUrl: string
  completionScore: number
}

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    let cancelled = false

    // Wait for Firebase auth to initialize via
    // onAuthStateChanged — this fires once with
    // the current user (or null) after SDK init.
    // Do NOT use auth.currentUser directly — it's
    // null before auth initializes even if logged in.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return

      if (!user) {
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
        if (cancelled) return

        const res = await fetch(
          `${CF_FUNCTIONS_BASE}/getProfile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (cancelled) return

        if (!res.ok) {
          setError('Failed to load profile')
          setLoading(false)
          return
        }

        const json = await res.json()
        setData(json)
      } catch (err) {
        if (!cancelled) {
          setError('Failed to fetch profile')
          console.error('useProfile error:', err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          // Unsubscribe after first successful auth event
          // to prevent re-fetching on token refresh
          unsubscribe()
        }
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [refetchTrigger])

  const refetch = () => {
    setLoading(true)
    setError(null)
    setRefetchTrigger(t => t + 1)
  }

  return { data, loading, error, refetch }
}
