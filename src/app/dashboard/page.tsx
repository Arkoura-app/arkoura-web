'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-[var(--font-manrope)] text-3xl font-bold text-[#1C2B1E] tracking-tight mb-2">
        Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} 👋
      </h1>
      <p className="text-gray-500 text-base">Your health journal is ready.</p>
    </div>
  )
}
