'use client'

import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

// Render entirely on client — never during build/SSR
// This prevents Firebase initialization at build time
const VerifiedContent = dynamicImport(
  () => import('@/components/auth/VerifiedContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)

export default function VerifiedPage() {
  return <VerifiedContent />
}
