'use client'

import { useState, useEffect, useCallback } from 'react'
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
  }
  qrToken: string
  qrUrl: string
  completionScore: number
}

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    const currentUser = auth?.currentUser
    if (!currentUser) {
      setLoading(false)
      return
    }
    try {
      const token = await currentUser.getIdToken()
      const res = await fetch(`${CF_FUNCTIONS_BASE}/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch profile')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { data, loading, error, refetch: fetchProfile }
}
