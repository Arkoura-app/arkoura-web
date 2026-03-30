'use client'

import { useState, useEffect } from 'react'
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
  const [fetchCount, setFetchCount] = useState(0)

  useEffect(() => {
    // Only fetch once on mount
    let cancelled = false

    async function fetchProfile() {
      // Wait for Firebase auth to initialize
      const user = auth?.currentUser
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
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
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()

    return () => { cancelled = true }
  }, [fetchCount]) // fetchCount allows manual refetch

  const refetch = () => setFetchCount(c => c + 1)

  return { data, loading, error, refetch }
}
