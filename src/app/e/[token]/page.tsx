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
    priority: number
  }>
}

// ─── Severity badge ───────────────────────────────────
function CriticalBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      ⚠ Critical
    </span>
  )
}

// ─── Section card ─────────────────────────────────────
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
    <div
      className="bg-white rounded-2xl p-5 mb-3"
      style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[#1C2B1E] uppercase tracking-wider mb-3">
        <span>{icon}</span>
        {title}
      </h2>
      {children ?? <p className="text-sm text-gray-400 italic">{empty}</p>}
    </div>
  )
}

// ─── Blood type badge ─────────────────────────────────
function BloodTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 text-red-700 font-bold text-lg">
      {type}
    </span>
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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading health profile...</p>
        </div>
      </div>
    )
  }

  // ── Not found ──
  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
            Profile not found
          </h1>
          <p className="text-sm text-gray-500">
            This QR code doesn&apos;t match any active Arkoura profile.
          </p>
        </div>
      </div>
    )
  }

  // ── Retired token ──
  if (status === 'retired') {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔄</p>
          <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
            Profile updated
          </h1>
          <p className="text-sm text-gray-500">{retiredMessage}</p>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (status === 'error' || !data) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="font-[var(--font-manrope)] text-xl font-bold text-[#1C2B1E] mb-2">
            Unable to load profile
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            This profile exists but couldn&apos;t be loaded right now. Please try again in a
            moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ── Profile found ──
  const { profile, primaryPhysician, conditions, allergies, medications, emergencyContacts } =
    data

  const displayName = profile.preferredName ?? profile.firstName ?? 'This person'

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')

  const criticalAllergies = allergies.filter(
    (a) => a.isCritical || a.severity === 'life_threatening'
  )
  const criticalConditions = conditions.filter((c) => c.isCritical)
  const criticalMeds = medications.filter((m) => m.isCritical)
  const hasCritical =
    criticalAllergies.length > 0 || criticalConditions.length > 0 || criticalMeds.length > 0

  return (
    <div className="min-h-screen bg-[#F0F2EE]">
      {/* ── Header ── */}
      <div
        style={{ background: 'linear-gradient(145deg, #1C2B1E, #2D4A31)' }}
        className="px-5 pt-10 pb-6"
      >
        {/* Arkoura logo */}
        <div className="flex items-center gap-2 mb-6">
          <Image src="/icon.png" alt="Arkoura" width={24} height={24} className="opacity-80" />
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
            Arkoura · Emergency Profile
          </span>
        </div>

        {/* Name + blood type */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-manrope)] text-3xl font-bold text-white tracking-tight leading-tight">
              {fullName || displayName}
            </h1>
            {profile.dateOfBirth && (
              <p className="text-white/60 text-sm mt-1">
                DOB:{' '}
                {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {profile.primaryLanguage && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
                  🌍 {profile.primaryLanguage.toUpperCase()}
                </span>
              )}
              {profile.organDonor && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4A7A50]/40 text-white/90 text-xs font-medium">
                  ♥ Organ Donor
                </span>
              )}
            </div>
          </div>
          {profile.bloodType && profile.bloodType !== 'unknown' && (
            <BloodTypeBadge type={profile.bloodType} />
          )}
        </div>
      </div>

      {/* ── Critical alert banner ── */}
      {hasCritical && (
        <div className="bg-red-600 px-5 py-3">
          <p className="text-white text-sm font-semibold flex items-center gap-2">
            ⚠️ Critical health information below — read before treating
          </p>
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Allergies — first, most critical */}
        <Section title="Allergies" icon="🚨" empty="No allergies on record">
          {allergies.length > 0 && (
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <div
                  key={allergy.id}
                  className={`p-3 rounded-xl border ${
                    allergy.isCritical
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-[#1C2B1E]">{allergy.allergen}</p>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {allergy.allergenType} · {allergy.severity.replace('_', ' ')}
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
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-[#1C2B1E]">{condition.name}</p>
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
                      : 'bg-gray-50 border-gray-100'
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
        <Section title="Emergency Contacts" icon="📞" empty="No emergency contacts listed">
          {emergencyContacts.length > 0 && (
            <div className="space-y-2">
              {emergencyContacts.map((contact, i) => (
                <div
                  key={contact.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
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
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                    >
                      📞 Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Primary Physician */}
        {primaryPhysician && (
          <Section title="Primary Physician" icon="👨‍⚕️">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
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

        {/* Footer disclaimer */}
        <div className="text-center py-6">
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
            This is {displayName}&apos;s personal health journal — their own recollection of
            health events, not a verified clinical record. Use professional judgment in all
            clinical decisions.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Image src="/icon.png" alt="Arkoura" width={16} height={16} className="opacity-40" />
            <p className="text-xs text-gray-300">arkoura.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
