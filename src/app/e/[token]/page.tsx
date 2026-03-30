'use client'

export const runtime = 'edge'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

// ─── Types ────────────────────────────────────────────

interface EmergencyProfile {
  profile: {
    firstName: string | null
    lastName: string | null
    preferredName: string | null
    dateOfBirth: string | null
    biologicalSex: string | null
    bloodType: string | null
    primaryLanguage: string | null
    organDonor: boolean | null
    profilePhotoUrl: string | null
    quickGlanceIcons: string[] | null
    city: string | null
    country: string | null
  }
  primaryPhysician: {
    name: string
    specialty: string
    country: string
    city: string
    phone: string
    language: string
    notes?: string
  } | null
  conditions: Array<{
    id: string
    name: string
    isCritical: boolean
    notes?: string
  }>
  allergies: Array<{
    id: string
    allergen: string
    allergenType: string
    severity: string
    reaction?: string
    isCritical: boolean
  }>
  medications: Array<{
    id: string
    name: string
    dose?: string
    frequency?: string
    route?: string
    isCritical: boolean
  }>
  emergencyContacts: Array<{
    id: string
    name: string
    relationship: string
    phone: string
    email?: string
    priority: number
  }>
}

// ─── Constants ────────────────────────────────────────

const GLANCE_MAP: Record<string, { emoji: string; label: string }> = {
  cardiac: { emoji: '❤️', label: 'Cardiac' },
  neurological: { emoji: '🧠', label: 'Neuro' },
  diabetes: { emoji: '💉', label: 'Diabetes' },
  allergy: { emoji: '⚠️', label: 'Allergy' },
  respiratory: { emoji: '🫁', label: 'Respiratory' },
  blood: { emoji: '🩸', label: 'Blood' },
  neurodevelopmental: { emoji: '🧩', label: 'Neuro-dev' },
  pregnancy: { emoji: '🤰', label: 'Pregnancy' },
  device: { emoji: '🔧', label: 'Device' },
  dnr: { emoji: '📋', label: 'DNR/DNI' },
  medication: { emoji: '💊', label: 'Critical Med' },
  mobility: { emoji: '♿', label: 'Mobility' },
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'it', label: 'Italiano' },
  { code: 'ru', label: 'Русский' },
  { code: 'sv', label: 'Svenska' },
]

// ─── Sub-components ───────────────────────────────────

function CriticalBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex-shrink-0">
      ⚠ Critical
    </span>
  )
}

function Section({
  title,
  icon,
  children,
  empty,
}: {
  title: string
  icon: string
  children?: ReactNode
  empty?: string
}) {
  return (
    <div className="bg-[#FAFAF8] rounded-2xl p-4 mb-3 border border-[#E8EDE8]">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A7A50] mb-3">
        <span>{icon}</span>
        {title}
      </h2>
      {children ?? <p className="text-sm text-gray-400 italic">{empty}</p>}
    </div>
  )
}

// ─── Centered card wrapper for status pages ───────────

function StatusCard({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E8F2E6] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#1C2B1E]/10">
        <div
          style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
          className="px-6 pt-8 pb-6"
        >
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Arkoura" width={20} height={20} className="opacity-70" />
            <span className="text-white/50 text-xs tracking-widest uppercase">
              Arkoura · Emergency Profile
            </span>
          </div>
        </div>
        <div className="px-6 py-10 text-center">{children}</div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────

export default function EmergencyProfilePage() {
  const params = useParams()
  const token = params?.token as string

  const [data, setData] = useState<EmergencyProfile | null>(null)
  const [status, setStatus] = useState<
    'loading' | 'found' | 'not_found' | 'retired' | 'error'
  >('loading')
  const [retiredMessage, setRetiredMessage] = useState('')
  const [selectedLang, setSelectedLang] = useState('en')

  useEffect(() => {
    if (!token) return

    async function fetchProfile() {
      try {
        const res = await fetch(
          `${CF_FUNCTIONS_BASE}/getEmergencyProfile?token=${token}`
        )

        if (res.status === 404) {
          setStatus('not_found')
          return
        }

        if (res.status === 410) {
          const body = await res.json()
          setRetiredMessage(body.message ?? 'This QR code has been updated.')
          setStatus('retired')
          return
        }

        if (!res.ok) {
          setStatus('error')
          return
        }

        const profile = await res.json()
        setData(profile)
        setStatus('found')
      } catch (err) {
        console.error('Emergency profile fetch error:', err)
        setStatus('error')
      }
    }

    fetchProfile()
  }, [token])

  // ── Loading ──
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#E8F2E6] flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#1C2B1E]/10 mb-24">
          {/* Skeleton header */}
          <div
            style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
            className="px-6 pt-8 pb-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Image src="/icon.png" alt="Arkoura" width={20} height={20} className="opacity-70" />
              <span className="text-white/50 text-xs tracking-widest uppercase">
                Arkoura · Emergency Profile
              </span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse" />
              <div className="h-8 w-48 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
              <div className="flex gap-2 mt-1">
                <div className="h-7 w-16 rounded-full bg-white/10 animate-pulse" />
                <div className="h-7 w-20 rounded-full bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
          {/* Skeleton content */}
          <div className="px-5 py-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E8EDE8]">
                <div className="h-3 w-24 rounded-full bg-gray-200 animate-pulse mb-3" />
                <div className="space-y-2">
                  <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (status === 'not_found') {
    return (
      <StatusCard>
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
          Profile not found
        </h1>
        <p className="text-sm text-gray-500">
          This QR code doesn&apos;t match any active Arkoura profile.
        </p>
      </StatusCard>
    )
  }

  // ── Retired token ──
  if (status === 'retired') {
    return (
      <StatusCard>
        <p className="text-4xl mb-4">🔄</p>
        <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
          Profile updated
        </h1>
        <p className="text-sm text-gray-500">{retiredMessage}</p>
      </StatusCard>
    )
  }

  // ── Error ──
  if (status === 'error' || !data) {
    return (
      <StatusCard>
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
          Unable to load profile
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This profile exists but couldn&apos;t be loaded right now. Please try again in a moment.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
        >
          Try again
        </button>
      </StatusCard>
    )
  }

  // ── Profile found ──
  const { profile, primaryPhysician, conditions, allergies, medications, emergencyContacts } = data

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Unknown'

  const initials =
    [(profile.firstName ?? '').charAt(0), (profile.lastName ?? '').charAt(0)]
      .filter(Boolean)
      .join('')
      .toUpperCase() || '?'

  const hasCritical =
    allergies.some((a) => a.isCritical || a.severity === 'life_threatening') ||
    conditions.some((c) => c.isCritical) ||
    medications.some((m) => m.isCritical)

  const locationLine = [profile.city, profile.country].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-[#E8F2E6]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Single white card ── */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#1C2B1E]/10 mb-24">

          {/* ── SECTION 1: Header ── */}
          <div
            style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
            className="px-6 pt-8 pb-6"
          >
            {/* Top row: logo + label */}
            <div className="flex items-center gap-2 mb-6">
              <Image src="/icon.png" alt="Arkoura" width={20} height={20} className="opacity-70" />
              <span className="text-white/50 text-xs tracking-widest uppercase">
                Arkoura · Emergency Profile
              </span>
            </div>

            {/* Profile photo */}
            <div className="flex flex-col items-center mb-4">
              {profile.profilePhotoUrl ? (
                <Image
                  src={profile.profilePhotoUrl}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                  unoptimized
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#4A7A50]/40 flex items-center justify-center border-4 border-white/20">
                  <span className="text-3xl font-bold text-white">{initials}</span>
                </div>
              )}
            </div>

            {/* Name block */}
            <div className="text-center">
              <h1 className="font-[var(--font-manrope)] text-3xl font-bold text-white tracking-tight leading-tight">
                {fullName}
              </h1>
              {locationLine && (
                <p className="text-white/60 text-sm mt-1">
                  📍 {locationLine}
                </p>
              )}
              {profile.dateOfBirth && (
                <p className="text-white/50 text-xs mt-1">
                  DOB:{' '}
                  {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {profile.bloodType && profile.bloodType !== 'unknown' && (
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {profile.bloodType}
                </span>
              )}
              {profile.primaryLanguage && (
                <span className="bg-[#4A7A50]/30 text-white/90 px-2.5 py-1 rounded-full text-xs font-medium">
                  🌍 {profile.primaryLanguage.toUpperCase()}
                </span>
              )}
              {profile.organDonor && (
                <span className="bg-[#4A7A50]/30 text-white/90 px-2.5 py-1 rounded-full text-xs font-medium">
                  ♥ Organ Donor
                </span>
              )}
            </div>

            {/* Quick-glance icons */}
            {profile.quickGlanceIcons && profile.quickGlanceIcons.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mt-3">
                {profile.quickGlanceIcons.map((key) => {
                  const item = GLANCE_MAP[key]
                  if (!item) return null
                  return (
                    <div
                      key={key}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20"
                    >
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-white/90 text-xs font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── SECTION 2: Language selector strip ── */}
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide bg-[#F0F4EE] border-b border-[#E8EDE8]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedLang === lang.code
                    ? 'bg-[#4A7A50] text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* ── Critical alert banner ── */}
          {hasCritical && (
            <div className="bg-red-600 px-5 py-3 flex items-center gap-2">
              <span className="text-white text-sm font-semibold">
                ⚠️ Critical health information — read before treating
              </span>
            </div>
          )}

          {/* ── SECTION 3: Health data ── */}
          <div className="px-5 py-4">

            {/* Allergies */}
            <Section title="Allergies" icon="🚨" empty="No allergies on record">
              {allergies.length > 0 && (
                <div className="space-y-2">
                  {allergies.map((allergy) => (
                    <div
                      key={allergy.id}
                      className={`p-3 rounded-xl border ${
                        allergy.isCritical
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#1C2B1E]">
                            {allergy.allergen}
                          </p>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">
                            {allergy.allergenType} · {allergy.severity.replace(/_/g, ' ')}
                          </p>
                          {allergy.reaction && (
                            <p className="text-xs text-gray-600 mt-1">
                              Reaction: {allergy.reaction}
                            </p>
                          )}
                        </div>
                        {allergy.isCritical && <CriticalBadge />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Conditions */}
            <Section title="Medical Conditions" icon="🏥" empty="No conditions on record">
              {conditions.length > 0 && (
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div
                      key={condition.id}
                      className={`p-3 rounded-xl border ${
                        condition.isCritical
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#1C2B1E]">
                            {condition.name}
                          </p>
                          {condition.notes && (
                            <p className="text-xs text-gray-600 mt-1">{condition.notes}</p>
                          )}
                        </div>
                        {condition.isCritical && <CriticalBadge />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Medications */}
            <Section title="Current Medications" icon="💊" empty="No medications on record">
              {medications.length > 0 && (
                <div className="space-y-2">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className={`p-3 rounded-xl border ${
                        med.isCritical
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#1C2B1E]">{med.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {[med.dose, med.frequency, med.route].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        {med.isCritical && <CriticalBadge />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Emergency Contacts */}
            <Section
              title="Emergency Contacts"
              icon="📞"
              empty="No emergency contacts listed"
            >
              {emergencyContacts.length > 0 && (
                <div className="space-y-2">
                  {emergencyContacts.map((contact, i) => (
                    <div
                      key={contact.id}
                      className="p-3 rounded-xl bg-white border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-[#1C2B1E]">
                            {contact.name}
                            {i === 0 && (
                              <span className="ml-2 text-xs font-normal text-[#4A7A50]">
                                Primary
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">
                            {contact.relationship}
                          </p>
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-xs text-[#4A7A50] mt-0.5 block"
                            >
                              {contact.email}
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                            style={{
                              background: 'linear-gradient(145deg,#44664a,#7a9e7e)',
                            }}
                          >
                            📞 Call
                          </a>
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#4A7A50] border border-[#4A7A50]"
                            >
                              ✉️ Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Primary Physician */}
            {primaryPhysician && (
              <Section title="Primary Physician" icon="👨‍⚕️">
                <div className="p-3 rounded-xl bg-white border border-gray-100">
                  <p className="font-semibold text-sm text-[#1C2B1E]">{primaryPhysician.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {primaryPhysician.specialty} · {primaryPhysician.city},{' '}
                    {primaryPhysician.country}
                  </p>
                  {primaryPhysician.notes && (
                    <p className="text-xs text-gray-600 mt-1">{primaryPhysician.notes}</p>
                  )}
                  <a
                    href={`tel:${primaryPhysician.phone}`}
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                  >
                    📞 {primaryPhysician.phone}
                  </a>
                </div>
              </Section>
            )}

            {/* ── Disclaimer footer (inside card) ── */}
            <div className="text-center px-5 py-6 border-t border-[#E8EDE8] mt-1">
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                This is {profile.firstName || 'the profile holder'}&apos;s personal health
                journal — their own recollection of health events, not a verified clinical
                record.
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Image
                  src="/icon.png"
                  alt="Arkoura"
                  width={16}
                  height={16}
                  className="opacity-30"
                />
                <p className="text-xs text-gray-300">arkoura.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Sticky bottom action buttons ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #E8EDE8',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
          {/* Emergency button */}
          <button
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(145deg,#DC2626,#EF4444)' }}
          >
            🆘 Emergency
          </button>

          {/* Appointment button */}
          <button className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-[#1C2B1E] bg-[#E8F2E6] flex items-center justify-center gap-2 active:scale-95 transition-transform border border-[#C8DEC4]">
            📅 Appointment
          </button>

          {/* Dismiss button */}
          <button
            className="px-4 py-3.5 rounded-2xl text-sm font-medium text-gray-400 bg-gray-100 active:scale-95 transition-transform"
            onClick={() => window.history.back()}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
