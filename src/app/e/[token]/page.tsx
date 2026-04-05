'use client'

export const runtime = 'edge'

import type { ReactNode, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { translateRelationship } from '@/lib/relationships'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { COUNTRY_CODES } from '@/lib/countryCodes'

// ─── Helpers ──────────────────────────────────────────

function parseDateOfBirth(dob: string): Date {
  // Parse YYYY-MM-DD as local date to avoid
  // UTC offset shifting the day
  const [year, month, day] = dob.split('-').map(Number)
  return new Date(year, month - 1, day)
}

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
    phoneVerified: boolean | null
    emergencyNotes: string | null
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

// ─── Translation maps ─────────────────────────────────

const ALLERGY_TYPE_KEYS: Record<string, string> = {
  drug: 'allergy.type.drug',
  food: 'allergy.type.food',
  environmental: 'allergy.type.environmental',
  contact: 'allergy.type.contact',
  other: 'allergy.type.other',
}

const SEVERITY_KEYS: Record<string, string> = {
  mild: 'allergy.severity.mild',
  moderate: 'allergy.severity.moderate',
  severe: 'allergy.severity.severe',
  life_threatening: 'allergy.severity.life_threatening',
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
  directive: { emoji: '📋', label: 'DNR/DNI' },
  medication: { emoji: '💊', label: 'Critical Med' },
  mobility: { emoji: '♿', label: 'Mobility' },
}

const ICON_I18N_SUFFIX: Record<string, string> = {
  directive: 'dnr',
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  it: 'Italiano',
  ru: 'Русский',
  sv: 'Svenska',
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

function CriticalBadge({ lang }: { lang: Lang }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex-shrink-0">
      ⚠ {t('emergency.critical', lang)}
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

  // ── Emergency overlay state ──
  const [showEmergencyOptions, setShowEmergencyOptions] = useState(false)
  const [emergencyTriggeredAt, setEmergencyTriggeredAt] = useState<string | null>(null)
  const [locationShared, setLocationShared] = useState(false)
  const [locationDenied, setLocationDenied] = useState(false)
  const [mapsUrl, setMapsUrl] = useState('')
  const [wazeUrl, setWazeUrl] = useState('')

  // ── Appointment overlay state ──
  const [appointmentStep, setAppointmentStep] = useState<'form' | 'otp' | 'no_phone' | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [requesterForm, setRequesterForm] = useState({ name: '', role: '', phone: '', email: '' })
  const [otpForm, setOtpForm] = useState({ publicOtp: '', privateOtp: '' })
  const [appointmentError, setAppointmentError] = useState('')
  const [appointmentLoading, setAppointmentLoading] = useState(false)
  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState(false)
  const [apptCountryCode, setApptCountryCode] = useState('+506')
  const [apptLocalPhone, setApptLocalPhone] = useState('')

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

  // ── Emergency handlers ──
  async function handleEmergency() {
    const triggeredAt = new Date().toISOString()
    setEmergencyTriggeredAt(triggeredAt)
    setShowEmergencyOptions(true)
    await fetch(`${CF_FUNCTIONS_BASE}/confirmEmergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'phase2', triggeredAt }),
    })
  }

  function handleShareLocation() {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const res = await fetch(`${CF_FUNCTIONS_BASE}/confirmEmergency`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, action: 'location', lat, lng }),
        })
        const locationData = await res.json()
        setLocationShared(true)
        setMapsUrl(locationData.mapsUrl)
        setWazeUrl(locationData.wazeUrl)
      },
      () => {
        setLocationDenied(true)
      }
    )
  }

  async function handleCancel() {
    await fetch(`${CF_FUNCTIONS_BASE}/confirmEmergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, action: 'cancel', triggeredAt: emergencyTriggeredAt }),
    })
    setShowEmergencyOptions(false)
    setEmergencyTriggeredAt(null)
  }

  // ── Appointment handlers ──
  function handleAppointmentTap() {
    if (!data?.profile?.phoneVerified) {
      setAppointmentStep('no_phone')
      return
    }
    setAppointmentStep('form')
  }

  async function handleAppointmentSubmit(e: FormEvent) {
    e.preventDefault()
    setAppointmentLoading(true)
    setAppointmentError('')
    const res = await fetch(`${CF_FUNCTIONS_BASE}/requestAppointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        requesterName: requesterForm.name,
        requesterRole: requesterForm.role,
        requesterPhone: `${apptCountryCode}${apptLocalPhone}`,
        requesterEmail: requesterForm.email,
      }),
    })
    const apptData = await res.json()
    if (apptData.sessionId) {
      setSessionId(apptData.sessionId)
      setAppointmentStep('otp')
    } else {
      setAppointmentError('Failed to send codes. Please try again.')
    }
    setAppointmentLoading(false)
  }

  async function handleValidateOTP() {
    setAppointmentLoading(true)
    setAppointmentError('')
    const res = await fetch(`${CF_FUNCTIONS_BASE}/validateAppointmentOTP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        publicOtp: otpForm.publicOtp,
        privateOtp: otpForm.privateOtp,
      }),
    })
    const otpData = await res.json()
    if (otpData.success) {
      setAppointmentStep(null)
      setShowAppointmentSuccess(true)
    } else {
      if (otpData.error === 'otp_expired') {
        setAppointmentError('Code has expired. Please start over.')
      } else if (otpData.remainingAttempts !== undefined) {
        setAppointmentError(`Incorrect code. ${otpData.remainingAttempts} attempt(s) remaining.`)
      } else {
        setAppointmentError('Invalid code. Please try again.')
      }
    }
    setAppointmentLoading(false)
  }

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

  const firstName = data?.profile?.firstName ?? ''
  const lastName = data?.profile?.lastName ?? ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'

  const photoUrl = data?.profile?.profilePhotoUrl ?? null

  const initials =
    [firstName.charAt(0), lastName.charAt(0)]
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
                Arkoura · {t('emergency.profileOf', selectedLang as Lang)}
              </span>
            </div>

            {/* Profile photo */}
            <div className="flex flex-col items-center mb-4">
              {photoUrl ? (
                <button
                  onClick={() => window.open(photoUrl, '_blank')}
                  className="relative group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/20 cursor-pointer group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs bg-black/30 px-2 py-1 rounded-full">
                      View
                    </span>
                  </div>
                </button>
              ) : (
                <div className="w-28 h-28 rounded-full bg-[#4A7A50]/40 flex items-center justify-center border-4 border-white/20">
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
                  {t('emergency.dob', selectedLang as Lang)}:{' '}
                  {parseDateOfBirth(profile.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {profile.primaryLanguage && (
                <p className="text-white/60 text-xs mt-2">
                  {firstName}&apos;s {t('emergency.languages', selectedLang as Lang)}:{' '}
                  <span className="text-white/90 font-medium">
                    {LANGUAGE_NAMES[profile.primaryLanguage] ?? profile.primaryLanguage}
                  </span>{' '}
                  — {t('emergency.languagePrimary', selectedLang as Lang)}
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
                        {t(`icon.${ICON_I18N_SUFFIX[key] ?? key}`, selectedLang as Lang)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Emergency Notes Banner ── */}
          {profile.emergencyNotes && (
            <div className="mx-4 mt-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
              <p className="text-sm text-amber-800 leading-relaxed">
                {profile.emergencyNotes}
              </p>
            </div>
          )}

          {/* ── SECTION 2: Language selector strip ── */}
          <div className="relative bg-[#F0F4EE] border-b border-[#E8EDE8]">
            {/* Right fade — signals more content */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F0F4EE] to-transparent pointer-events-none z-10" />
            {/* Left fade — shown when scrolled */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F0F4EE] to-transparent pointer-events-none z-10" />
            <div
              className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    selectedLang === lang.code
                      ? 'bg-[#4A7A50] text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-gray-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
              {/* Spacer so last item isn't hidden behind gradient */}
              <div className="flex-shrink-0 w-12" />
            </div>
          </div>

          {/* ── Critical alert banner ── */}
          {hasCritical && (
            <div className="bg-red-600 px-5 py-3 flex items-center gap-2">
              <span className="text-white text-sm font-semibold">
                ⚠️ {t('emergency.critical', selectedLang as Lang)} — read before treating
              </span>
            </div>
          )}

          {/* ── SECTION 3: Health data ── */}
          <div className="px-5 py-4">

            {/* Allergies */}
            <Section title={t('emergency.allergies', selectedLang as Lang)} icon="🚨" empty={t('emergency.noAllergies', selectedLang as Lang)}>
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
                            {(() => {
                              const typeKey = ALLERGY_TYPE_KEYS[allergy.allergenType]
                              const typeLabel = typeKey ? t(typeKey, selectedLang as Lang) : allergy.allergenType
                              const sevKey = SEVERITY_KEYS[allergy.severity]
                              const sevLabel = sevKey ? t(sevKey, selectedLang as Lang) : allergy.severity.replace(/_/g, ' ')
                              return `${typeLabel} · ${sevLabel}`
                            })()}
                          </p>
                          {allergy.reaction && (
                            <p className="text-xs text-gray-600 mt-1">
                              {allergy.reaction}
                            </p>
                          )}
                        </div>
                        {allergy.isCritical && <CriticalBadge lang={selectedLang as Lang} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Conditions */}
            <Section title={t('emergency.conditions', selectedLang as Lang)} icon="🏥" empty={t('emergency.noConditions', selectedLang as Lang)}>
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
                        {condition.isCritical && <CriticalBadge lang={selectedLang as Lang} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Medications */}
            <Section title={t('emergency.medications', selectedLang as Lang)} icon="💊" empty={t('emergency.noMedications', selectedLang as Lang)}>
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
                        {med.isCritical && <CriticalBadge lang={selectedLang as Lang} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Emergency Contacts */}
            <Section
              title={t('emergency.contacts', selectedLang as Lang)}
              icon="📞"
              empty={t('emergency.noContacts', selectedLang as Lang)}
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
                                {t('common.primary', selectedLang as Lang)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {translateRelationship(contact.relationship, selectedLang)}
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
                            📞 {t('emergency.call', selectedLang as Lang)}
                          </a>
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#4A7A50] border border-[#4A7A50]"
                            >
                              ✉️ {t('emergency.email', selectedLang as Lang)}
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
              <Section title={t('emergency.physician', selectedLang as Lang)} icon="👨‍⚕️">
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
                {t('emergency.disclaimer', selectedLang as Lang)}
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
        className="fixed bottom-0 left-0 right-0 z-40"
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
            onClick={handleEmergency}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(145deg,#DC2626,#EF4444)' }}
          >
            {t('emergency.action.emergency', selectedLang as Lang)}
          </button>

          {/* Appointment button */}
          <button
            onClick={handleAppointmentTap}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-[#1C2B1E] bg-[#E8F2E6] flex items-center justify-center gap-2 active:scale-95 transition-transform border border-[#C8DEC4]"
          >
            {t('emergency.action.appointment', selectedLang as Lang)}
          </button>
        </div>
      </div>

      {/* ── Emergency Options Overlay ── */}
      {showEmergencyOptions && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEmergencyOptions(false)}
          />

          {/* Sheet */}
          <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

            {/* Header bar */}
            <div className="sticky top-0 z-10 bg-red-600 px-6 pt-6 pb-4">
              {/* Drag handle — mobile */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 md:hidden" />
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">
                  🚨 {t('emergency.title', selectedLang as Lang)}
                </h2>
                <button
                  onClick={() => setShowEmergencyOptions(false)}
                  className="text-white/70 hover:text-white transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">

              {/* Location share card */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <button
                  type="button"
                  onClick={handleShareLocation}
                  disabled={locationShared}
                  className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  <span className="text-2xl mt-0.5">📍</span>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1C2B1E] text-sm">
                      {t('emergency.shareLocation', selectedLang as Lang)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t('emergency.locationOneTime', selectedLang as Lang)}
                    </p>
                    {locationShared && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-xs text-[#4A7A50] font-medium">
                          ✓ {t('emergency.locationSent', selectedLang as Lang)}
                        </p>
                        {mapsUrl && (
                          <div className="flex gap-2">
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline"
                            >
                              Google Maps
                            </a>
                            <a
                              href={wazeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline"
                            >
                              Waze
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    {locationDenied && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ {t('emergency.locationDenied', selectedLang as Lang)}
                      </p>
                    )}
                  </div>
                </button>
              </div>

              {/* Emergency contacts card */}
              <div
                className="rounded-2xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('emergency.contacts', selectedLang as Lang)}
                  </p>
                </div>
                <div className="divide-y divide-gray-50">
                  {[...emergencyContacts]
                    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
                    .map((contact, i) => (
                      <div key={contact.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#1C2B1E]">
                              {contact.name}
                              {i === 0 && (
                                <span className="ml-2 text-xs font-medium text-[#4A7A50] bg-[#E8F2E6] px-1.5 py-0.5 rounded-full">
                                  Primary
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {translateRelationship(contact.relationship, selectedLang)}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {contact.phone && (
                              <>
                                <a
                                  href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366] text-white text-sm"
                                >
                                  💬
                                </a>
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4A7A50] text-white text-sm"
                                >
                                  📞
                                </a>
                              </>
                            )}
                            {contact.email && (
                              <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-600 text-sm"
                              >
                                ✉️
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Cancel link */}
              <div className="text-center pt-2 pb-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
                >
                  {t('emergency.cancelAlert', selectedLang as Lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No Phone Overlay ── */}
      {appointmentStep === 'no_phone' && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAppointmentStep(null)}
          />
          <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">📵</div>
              <h3 className="font-bold text-[#1C2B1E] text-lg mb-3">
                {t('appointment.unavailable', selectedLang as Lang)}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {t('appointment.noPhoneMessage', selectedLang as Lang)}
              </p>
              <p className="text-sm text-[#4A7A50] font-medium mb-8">
                {t('appointment.useEmergencyInstead', selectedLang as Lang)}
              </p>
              <button
                type="button"
                onClick={() => setAppointmentStep(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ← {t('common.back', selectedLang as Lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Appointment Overlay ── */}
      {((appointmentStep !== null && appointmentStep !== 'no_phone') || showAppointmentSuccess) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => { setAppointmentStep(null); setShowAppointmentSuccess(false); setAppointmentError('') }}
          />
          <div className="relative w-full sm:max-w-[480px] bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl">
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
            >
              <button
                onClick={() => { setAppointmentStep(null); setShowAppointmentSuccess(false); setAppointmentError('') }}
                className="text-white/70 hover:text-white transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
              <h2 className="text-white font-semibold text-base">📅 Appointment</h2>
            </div>
            <div className="px-5 py-5 overflow-y-auto max-h-[70vh]">
              {showAppointmentSuccess ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-4">✅</p>
                  <p className="text-base font-semibold text-[#1C2B1E]">Access Granted</p>
                  <p className="text-sm text-gray-500 mt-2">Appointment session verified successfully.</p>
                </div>
              ) : appointmentStep === 'form' ? (
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.yourName', selectedLang as Lang)} *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={t('appointment.yourName', selectedLang as Lang)}
                      value={requesterForm.name}
                      onChange={e => setRequesterForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4A7A50]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.yourRole', selectedLang as Lang)} *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={t('appointment.yourRolePlaceholder', selectedLang as Lang)}
                      value={requesterForm.role}
                      onChange={e => setRequesterForm(p => ({ ...p, role: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4A7A50]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.yourPhone', selectedLang as Lang)} *
                    </label>
                    <PhoneInput
                      value={apptLocalPhone ? `${apptCountryCode}${apptLocalPhone}` : ''}
                      onChange={(fullNumber) => {
                        const match = [...COUNTRY_CODES]
                          .sort((a, b) => b.code.length - a.code.length)
                          .find(c => fullNumber.startsWith(c.code))
                        if (match) {
                          setApptCountryCode(match.code)
                          setApptLocalPhone(fullNumber.slice(match.code.length))
                        }
                      }}
                      placeholder="88887777"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.yourEmail', selectedLang as Lang)} *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder={t('appointment.yourEmail', selectedLang as Lang)}
                      value={requesterForm.email}
                      onChange={e => setRequesterForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#4A7A50]"
                    />
                  </div>
                  {appointmentError && (
                    <p className="text-red-500 text-sm">{appointmentError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={appointmentLoading}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-60 active:scale-95 transition-transform"
                    style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
                  >
                    {appointmentLoading ? '…' : t('appointment.sendCode', selectedLang as Lang)}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.yourCode', selectedLang as Lang)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Enter the 6-digit code sent to your phone and email
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      value={otpForm.publicOtp}
                      onChange={e => setOtpForm(p => ({ ...p, publicOtp: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-center tracking-widest font-mono focus:outline-none focus:border-[#4A7A50]"
                      placeholder="——————"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t('appointment.holderCode', selectedLang as Lang)}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      {t('appointment.holderCodeHint', selectedLang as Lang)}
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      inputMode="numeric"
                      value={otpForm.privateOtp}
                      onChange={e => setOtpForm(p => ({ ...p, privateOtp: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-center tracking-widest font-mono focus:outline-none focus:border-[#4A7A50]"
                      placeholder="——————"
                    />
                  </div>
                  {appointmentError && (
                    <p className="text-red-500 text-sm mt-2">{appointmentError}</p>
                  )}
                  <button
                    onClick={handleValidateOTP}
                    disabled={
                      otpForm.publicOtp.length !== 6 ||
                      otpForm.privateOtp.length !== 6 ||
                      appointmentLoading
                    }
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-40 active:scale-95 transition-transform"
                    style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A32)' }}
                  >
                    {appointmentLoading ? 'Verifying…' : t('appointment.accessJournal', selectedLang as Lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
