'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import dynamic from 'next/dynamic'

const Sidebar = dynamic(
  () => import('@/components/layout/Sidebar'),
  { ssr: false }
)
const VerificationBanner = dynamic(
  () => import('@/components/layout/VerificationBanner')
    .then(mod => mod.VerificationBanner),
  { ssr: false }
)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/signin'
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Arkoura" className="w-10 h-10 opacity-60" />
          <div className="w-6 h-6 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Sidebar />
      <main className="md:ml-[260px] pb-20 md:pb-0">
        <VerificationBanner />
        {children}
      </main>
    </div>
  )
}
