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

    const cacheKey = `arkoura_profile_${user.uid}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed._cachedAt < 60000) {
          setData(parsed)
          setLoading(false)
          return
        }
      } catch {}
    }

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
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          ...json,
          _cachedAt: Date.now(),
        }))
      } catch {}
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

  const refetch = useCallback(() => {
    try {
      if (user?.uid) sessionStorage.removeItem(`arkoura_profile_${user.uid}`)
    } catch {}
    void fetchProfile()
  }, [fetchProfile, user])

  return {
    data,
    loading: authLoading || loading,
    error,
    refetch,
  }
}
