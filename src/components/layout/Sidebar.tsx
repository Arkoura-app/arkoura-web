'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hooks/useAuth'

function IconProfile() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="7" r="4" />
      <path d="M3,19 C3,14 17,14 17,19" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10,2 L3,5 L3,10 C3,14 6,17 10,18 C14,17 17,14 17,10 L17,5 Z" />
      <path d="M7,10 L9,12 L13,8" />
    </svg>
  )
}

function IconQR() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="4" y="4" width="3" height="3" rx="0.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="3" height="3" rx="0.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="3" height="3" rx="0.5" />
      <line x1="11" y1="11" x2="11" y2="13" />
      <line x1="11" y1="16" x2="11" y2="18" />
      <line x1="14" y1="11" x2="18" y2="11" />
      <line x1="18" y1="14" x2="18" y2="18" />
      <line x1="14" y1="15" x2="16" y2="15" />
    </svg>
  )
}

function IconJournal() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4,2 C4,2 7,3 10,3 C13,3 16,2 16,2 L16,18 C16,18 13,17 10,17 C7,17 4,18 4,18 Z" />
      <line x1="10" y1="3" x2="10" y2="17" />
      <line x1="6" y1="7" x2="9" y2="7" />
      <line x1="6" y1="10" x2="9" y2="10" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M10,5 L10,10 L14,13" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="10" r="3" />
      <path d="M10,2 L10,4 M10,16 L10,18 M2,10 L4,10 M16,10 L18,10 M4.5,4.5 L6,6 M14,14 L15.5,15.5 M15.5,4.5 L14,6 M6,14 L4.5,15.5" />
    </svg>
  )
}

const navItems = [
  { href: '/dashboard', label: 'Profile', icon: IconProfile },
  { href: '/dashboard/emergency', label: 'Emergency Data', icon: IconShield },
  { href: '/dashboard/qr', label: 'My QR', icon: IconQR },
  { href: '/dashboard/journal', label: 'Journal', icon: IconJournal },
  { href: '/dashboard/activity', label: 'Activity Log', icon: IconClock },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  async function handleSignOut() {
    if (auth) await signOut(auth)
    router.push('/')
  }

  const displayName = user?.displayName ?? user?.email ?? 'U'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] bg-[#1C2B1E] z-40">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Arkoura" className="w-8 h-8" />
          <span className="font-[var(--font-manrope)] text-white font-bold text-lg tracking-tight">
            Arkoura
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4A7A50]/20 text-[#A8C5A0] border-l-2 border-[#4A7A50]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <IconSettings />
            Settings
          </Link>

          {/* User row */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A7A50] flex items-center justify-center flex-shrink-0">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user?.displayName ?? user?.email ?? 'User'}
              </p>
              <button
                onClick={handleSignOut}
                className="text-white/40 text-xs hover:text-white/70 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1C2B1E] border-t border-white/10 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#A8C5A0]' : 'text-white/50'
                }`}
              >
                <Icon />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
