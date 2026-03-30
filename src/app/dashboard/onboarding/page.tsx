'use client'
export const runtime = 'edge'

import { useEffect, useState } from 'react'
import { cfFetch } from '@/lib/api'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'
import { auth } from '@/lib/firebase'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'pt', label: 'Português' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'it', label: 'Italiano' },
  { value: 'ru', label: 'Русский' },
  { value: 'sv', label: 'Svenska' },
]

const QUICK_ICONS = [
  { key: 'cardiac', emoji: '❤️', label: 'Cardiac condition' },
  { key: 'neurological', emoji: '🧠', label: 'Neurological' },
  { key: 'diabetes', emoji: '💉', label: 'Diabetes' },
  { key: 'allergy', emoji: '⚠️', label: 'Severe allergy' },
  { key: 'respiratory', emoji: '🫁', label: 'Respiratory' },
  { key: 'blood', emoji: '🩸', label: 'Blood disorder' },
  { key: 'neurodevelopmental', emoji: '🧩', label: 'Neurodevelopmental' },
  { key: 'pregnancy', emoji: '🤰', label: 'Pregnancy' },
  { key: 'device', emoji: '🔧', label: 'Medical device/implant' },
  { key: 'directive', emoji: '📋', label: 'Legal directive' },
  { key: 'medication', emoji: '💊', label: 'Critical medication' },
  { key: 'mobility', emoji: '♿', label: 'Mobility' },
]

const RELATIONSHIP_OPTIONS = [
  'Spouse / Partner',
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Caretaker',
  'Other',
]

const INPUT_CLS =
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1C2B1E] ' +
  'focus:outline-none focus:ring-2 focus:ring-[#4A7A50]/20 focus:border-[#4A7A50] transition-colors bg-white'

const LABEL_CLS = 'block text-xs font-medium text-gray-500 mb-1.5'

const PRIMARY_BTN =
  'w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity'
const PRIMARY_BTN_STYLE = { background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={`rounded-full transition-all duration-300 ${
            n === step
              ? 'bg-[#4A7A50] w-3 h-2'
              : n < step
              ? 'bg-[#4A7A50] w-2 h-2'
              : 'bg-[#E5E7EB] w-2 h-2'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)

  // Step 1
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Step 2
  const [language, setLanguage] = useState('en')
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])
  const [savingStep2, setSavingStep2] = useState(false)

  // Step 3
  const [contactName, setContactName] = useState('')
  const [contactRelationship, setContactRelationship] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [savingContact, setSavingContact] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    async function loadQr() {
      try {
        const token = await auth?.currentUser?.getIdToken()
        if (!token) return
        const res = await fetch(`${CF_FUNCTIONS_BASE}/getQrCode?format=base64`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = (await res.json()) as { dataUrl: string }
        setQrDataUrl(data.dataUrl)
      } catch {
        // silent — QR preview is decorative
      }
    }
    void loadQr()
  }, [])

  function toggleIcon(key: string) {
    setSelectedIcons((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      if (prev.length >= 5) return prev
      return [...prev, key]
    })
  }

  async function handleStep2Next() {
    setSavingStep2(true)
    try {
      await cfFetch('updateProfile', {
        method: 'PATCH',
        body: JSON.stringify({ primaryLanguage: language, quickGlanceIcons: selectedIcons }),
      })
      setStep(3)
    } finally {
      setSavingStep2(false)
    }
  }

  async function completeOnboarding() {
    await cfFetch('updateProfile', {
      method: 'PATCH',
      body: JSON.stringify({ onboardingComplete: true }),
    })
    window.location.href = '/dashboard'
  }

  async function handleSaveContact() {
    if (!contactName.trim() || !contactPhone.trim()) {
      setContactError('Name and phone are required.')
      return
    }
    setSavingContact(true)
    setContactError('')
    try {
      const body: Record<string, string | boolean> = {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        showOnEmergencyProfile: true,
      }
      if (contactRelationship) body.relationship = contactRelationship
      const res = await cfFetch('createEmergencyContact', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        setContactError(err.error ?? 'Failed to save contact. Please try again.')
        return
      }
      await completeOnboarding()
    } finally {
      setSavingContact(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <ProgressDots step={step} />

        {/* ── Step 1: Welcome ── */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Arkoura" className="w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold text-[#1C2B1E] mb-3">Welcome to Arkoura 🌿</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Your health profile is ready to build. Let&apos;s take 2 minutes so your emergency
              profile is ready when it matters most.
            </p>

            {/* QR preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-2 flex flex-col items-center w-full">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Your QR code"
                  className="w-[120px] h-[120px] rounded-xl"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-xl bg-gray-100 animate-pulse" />
              )}
              <p className="text-xs text-gray-400 mt-3">
                Your QR code is ready — complete your profile to make it useful
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className={`${PRIMARY_BTN} mt-6`}
              style={PRIMARY_BTN_STYLE}
            >
              Get started →
            </button>
          </div>
        )}

        {/* ── Step 2: Quick setup ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-[#1C2B1E] mb-5 text-center">
              A few quick settings
            </h2>

            <div className="mb-5">
              <label className={LABEL_CLS}>Primary language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={INPUT_CLS}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <p className={LABEL_CLS}>Quick-glance health icons</p>
              <p className="text-xs text-gray-400 mb-3">
                Select up to 5 icons that appear on your emergency profile
              </p>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_ICONS.map((icon) => {
                  const active = selectedIcons.includes(icon.key)
                  const disabled = !active && selectedIcons.length >= 5
                  return (
                    <button
                      key={icon.key}
                      type="button"
                      onClick={() => toggleIcon(icon.key)}
                      disabled={disabled}
                      title={icon.label}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                        active
                          ? 'border-[#4A7A50] bg-[#4A7A50]/5 text-[#4A7A50]'
                          : disabled
                          ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-[#4A7A50]/40 text-gray-500'
                      }`}
                    >
                      <span className="text-lg">{icon.emoji}</span>
                      <span className="leading-tight text-center">{icon.label.split('/')[0].trim()}</span>
                    </button>
                  )
                })}
              </div>
              {selectedIcons.length > 0 && (
                <p className="text-xs text-[#4A7A50] mt-2 text-center">
                  {selectedIcons.length}/5 selected
                </p>
              )}
            </div>

            <button
              onClick={() => void handleStep2Next()}
              disabled={savingStep2}
              className={PRIMARY_BTN}
              style={PRIMARY_BTN_STYLE}
            >
              {savingStep2 ? 'Saving…' : 'Next →'}
            </button>
          </div>
        )}

        {/* ── Step 3: Emergency contact ── */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-[#1C2B1E] mb-2 text-center">
              Add someone who can help
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              This person will be notified when someone scans your QR code.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className={LABEL_CLS}>
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. María García"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Relationship <span className="text-gray-300 font-normal">(optional)</span>
                </label>
                <select
                  value={contactRelationship}
                  onChange={(e) => setContactRelationship(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="">— select —</option>
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={LABEL_CLS}>
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className={INPUT_CLS}
                />
              </div>

              {contactError && (
                <p className="text-xs text-red-500">{contactError}</p>
              )}
            </div>

            <button
              onClick={() => void handleSaveContact()}
              disabled={savingContact}
              className={PRIMARY_BTN}
              style={PRIMARY_BTN_STYLE}
            >
              {savingContact ? 'Saving…' : 'Save contact'}
            </button>

            <p className="text-center mt-3">
              <button
                onClick={() => void completeOnboarding()}
                className="text-sm text-gray-400 underline"
              >
                Skip for now
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
