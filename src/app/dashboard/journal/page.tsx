'use client'
export const runtime = 'edge'

export default function JournalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div
        className="bg-white rounded-3xl p-12 text-center"
        style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
      >
        <p className="text-5xl mb-4">📖</p>
        <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] mb-3">
          Health Journal
        </h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Your personal health journal is coming soon. You&apos;ll be able to log symptoms,
          medications, visits, and more.
        </p>
      </div>
    </div>
  )
}
