'use client'

import { useState, useEffect, useCallback } from 'react'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'
import { useAuth } from './useAuth'

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
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const token = await user.getIdToken()
      const res = await fetch(
        `${CF_FUNCTIONS_BASE}/getProfile`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) {
        setError('Failed to load profile')
        return
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError('Failed to fetch profile')
      console.error('useProfile error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    // Wait for auth to initialize before fetching
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }
    fetchProfile()
  }, [user, authLoading, fetchProfile])

  return {
    data,
    loading: authLoading || loading,
    error,
    refetch: fetchProfile
  }
}
