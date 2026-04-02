'use client'

import type { FileRejection } from 'react-dropzone'
import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useProfileLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'
import { auth } from '@/lib/firebase'
import { cfFetch } from '@/lib/api'

// ─── Constants ────────────────────────────────────────

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

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const QUICK_ICONS = [
  { key: 'cardiac', emoji: '❤️', label: 'Cardiac' },
  { key: 'neurological', emoji: '🧠', label: 'Neurological' },
  { key: 'diabetes', emoji: '💉', label: 'Diabetes' },
  { key: 'allergy', emoji: '⚠️', label: 'Severe Allergy' },
  { key: 'respiratory', emoji: '🫁', label: 'Respiratory' },
  { key: 'blood', emoji: '🩸', label: 'Blood Disorder' },
  { key: 'neurodevelopmental', emoji: '🧩', label: 'Neuro-\u200Bdev' },
  { key: 'pregnancy', emoji: '🤰', label: 'Pregnancy' },
  { key: 'device', emoji: '🔧', label: 'Med Device' },
  { key: 'directive', emoji: '📋', label: 'DNR / DNI' },
  { key: 'medication', emoji: '💊', label: 'Critical Med' },
  { key: 'mobility', emoji: '♿', label: 'Mobility' },
]

const CIRCUMFERENCE = 251.2

// ─── Schema ───────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'Max 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Max 100 characters'),
  preferredName: z.string().max(100, 'Max 100 characters').optional(),
  dateOfBirth: z.string().optional(),
  biologicalSex: z.string().optional(),
  bloodType: z.string().optional(),
  primaryLanguage: z.string().optional(),
  organDonor: z.boolean().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// ─── Style helpers ────────────────────────────────────

function inputCls(hasError: boolean): string {
  return [
    'w-full px-3 py-2.5 rounded-xl border text-sm text-[#1C2B1E]',
    'focus:outline-none focus:ring-2 focus:ring-[#4A7A50]/20 focus:border-[#4A7A50]',
    'transition-colors placeholder:text-gray-300',
    hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200',
  ].join(' ')
}

const selectCls = [
  'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#1C2B1E]',
  'focus:outline-none focus:ring-2 focus:ring-[#4A7A50]/20 focus:border-[#4A7A50]',
  'transition-colors',
].join(' ')

const cardCls = 'bg-white rounded-3xl p-6'
const cardShadow = { boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }

// ─── Page ─────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useProfile()
  const { lang } = useProfileLang(data?.profile?.primaryLanguage)

  // ── Ring animation state ──
  const [animatedScore, setAnimatedScore] = useState(0)

  // ── Photo state ──
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  // ── Form state ──
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // ── Icons state ──
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])
  const [iconsSaving, setIconsSaving] = useState(false)

  // ── Form setup ──
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: '',
      biologicalSex: '',
      bloodType: '',
      primaryLanguage: '',
      organDonor: false,
    },
  })

  // ── Populate form from profile data ──
  useEffect(() => {
    if (!data) return
    reset({
      firstName: data.profile.firstName ?? '',
      lastName: data.profile.lastName ?? '',
      preferredName: data.profile.preferredName ?? '',
      dateOfBirth: data.profile.dateOfBirth ?? '',
      biologicalSex: data.profile.biologicalSex ?? '',
      bloodType: data.profile.bloodType ?? '',
      primaryLanguage: data.profile.primaryLanguage ?? '',
      organDonor: data.profile.organDonor ?? false,
    })
  }, [data, reset])

  // ── Initialize photo preview from profile ──
  useEffect(() => {
    if (data?.profile?.profilePhotoUrl) {
      setPhotoPreview(data.profile.profilePhotoUrl)
    }
  }, [data])

  // ── Initialize icons from profile data ──
  useEffect(() => {
    if (data?.profile?.quickGlanceIcons) {
      setSelectedIcons(data.profile.quickGlanceIcons)
    }
  }, [data])

  // ── Animate completion ring ──
  useEffect(() => {
    const raw = data?.completionScore
    if (raw === undefined) return
    const adjusted =
      raw === 95 && (data?.profile?.profilePhotoUrl ?? data?.profile?.profilePhotoRef)
        ? 100
        : raw
    const timer = setTimeout(() => setAnimatedScore(adjusted), 100)
    return () => clearTimeout(timer)
  }, [data])

  // ── Photo drop handler ──
  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      setPhotoError(null)

      if (rejections.length > 0) {
        setPhotoError('File must be JPEG, PNG, or HEIC and under 5 MB')
        return
      }

      const file = acceptedFiles[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('File must be under 5 MB')
        return
      }

      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        setPhotoPreview(dataUrl)

        const currentUser = auth?.currentUser
        if (!currentUser) return

        setPhotoUploading(true)
        try {
          const token = await currentUser.getIdToken()
          const res = await fetch(`${CF_FUNCTIONS_BASE}/uploadProfilePhoto`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: dataUrl.split(',')[1],
              mimeType: file.type,
            }),
          })
          if (!res.ok) {
            const err = await res.json()
            console.error('Photo upload failed:', err)
            setPhotoError('Failed to upload photo. Please try again.')
            return
          }
          const { signedUrl } = await res.json() as { signedUrl: string }
          setPhotoPreview(signedUrl)
        } catch (err) {
          console.error('Photo upload error:', err)
          setPhotoError('Failed to upload photo. Please try again.')
        } finally {
          setPhotoUploading(false)
        }
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  })

  // ── Auto-save quick-glance icons ──
  const saveQuickGlanceIcons = useCallback(async (icons: string[]) => {
    setIconsSaving(true)
    try {
      const res = await cfFetch('updateProfile', {
        method: 'PATCH',
        body: JSON.stringify({ quickGlanceIcons: icons }),
      })
      const body = await res.json()
      console.log('updateProfile response:', res.status, body)
    } catch {
      // silent fail — auto-save
    } finally {
      setIconsSaving(false)
    }
  }, [])

  function toggleIcon(key: string) {
    const isSelected = selectedIcons.includes(key)
    const newIcons = isSelected
      ? selectedIcons.filter((k) => k !== key)
      : selectedIcons.length < 5
        ? [...selectedIcons, key]
        : selectedIcons
    console.log('Icon toggled:', key, newIcons)
    if (newIcons !== selectedIcons) {
      setSelectedIcons(newIcons)
      void saveQuickGlanceIcons(newIcons)
    }
  }

  // ── Form submit ──
  async function onSubmit(values: ProfileFormValues) {
    const currentUser = auth?.currentUser
    if (!currentUser) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      const token = await currentUser.getIdToken()
      const cleanData = Object.fromEntries(
        Object.entries(values).filter(([, v]) => {
          if (Array.isArray(v)) return true
          return v !== '' && v !== null && v !== undefined
        })
      )
      const res = await fetch(`${CF_FUNCTIONS_BASE}/updateProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanData),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      await refetch()
    } catch {
      setSaveError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Computed ──
  const displayName = user?.displayName ?? user?.email ?? 'U'
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const score = data?.completionScore ?? 0
  const displayScore =
    score === 95 && (data?.profile?.profilePhotoUrl ?? data?.profile?.profilePhotoRef)
      ? 100
      : score
  const ringColor =
    displayScore === 100
      ? '#4A7A50'
      : displayScore >= 85
        ? '#86EFAC'
        : displayScore >= 60
          ? '#F59E0B'
          : '#DC2626'
  const ringOffset = CIRCUMFERENCE * (1 - animatedScore / 100)

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    )
  }

  // ── Page ──
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-8">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] tracking-tight">
          {t('profile.title', lang)}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t('emergency.subtitle', lang)}
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Left column ── */}
        <div className="space-y-4">

          {/* Completion Ring */}
          <div className={cardCls} style={cardShadow}>
            <h2 className="font-[var(--font-manrope)] text-sm font-bold text-[#1C2B1E] uppercase tracking-wider mb-1">
              {t('profile.completion', lang)}
            </h2>
            <div className="flex flex-col items-center py-4 gap-2">
              <svg
                viewBox="0 0 100 100"
                className="w-32 h-32"
                aria-label={`${displayScore}% complete`}
              >
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                {/* Progress */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 50 50)"
                  style={{
                    transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease',
                  }}
                />
                {/* Score text */}
                <text
                  x="50"
                  y="46"
                  textAnchor="middle"
                  fill="#1C2B1E"
                  fontSize="20"
                  fontWeight="700"
                  fontFamily="var(--font-manrope), sans-serif"
                >
                  {animatedScore}%
                </text>
                <text
                  x="50"
                  y="62"
                  textAnchor="middle"
                  fill="#9CA3AF"
                  fontSize="11"
                >
                  Complete
                </text>
              </svg>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                {displayScore === 100
                  ? t('profile.complete', lang)
                  : displayScore >= 85
                    ? 'Almost complete'
                    : displayScore >= 60
                      ? t('profile.addMoreInfo', lang)
                      : t('profile.addContact', lang)}
              </p>
              {displayScore < 60 && (
                <a
                  href="/dashboard/emergency"
                  className="mt-1 px-4 py-2 rounded-xl text-sm font-semibold text-white text-center"
                  style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                >
                  {t('profile.addEmergencyContact', lang)}
                </a>
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <div className={cardCls} style={cardShadow}>
            <h2 className="font-[var(--font-manrope)] text-sm font-bold text-[#1C2B1E] uppercase tracking-wider mb-4">
              {t('profile.profilePhoto', lang)}
            </h2>
            <div className="flex flex-col items-center gap-3">
              <div
                {...getRootProps()}
                className={[
                  'w-24 h-24 rounded-full overflow-hidden relative cursor-pointer',
                  'border-2 border-dashed transition-colors',
                  isDragActive
                    ? 'border-[#4A7A50] bg-[#4A7A50]/5'
                    : 'border-gray-200 hover:border-[#4A7A50]/60',
                ].join(' ')}
              >
                <input {...getInputProps()} />
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#4A7A50] flex items-center justify-center">
                    <span className="text-white text-2xl font-bold select-none">
                      {initials}
                    </span>
                  </div>
                )}
                {/* Upload overlay */}
                {photoUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                {isDragActive ? (
                  <span className="text-[#4A7A50] font-medium">Drop to upload</span>
                ) : (
                  <>
                    {t('profile.uploadPhoto', lang)}
                    <br />
                    <span className="text-gray-300">JPEG, PNG, HEIC · max 5 MB</span>
                  </>
                )}
              </p>

              {photoError && (
                <p className="text-xs text-red-500 text-center">{photoError}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column — Profile Form ── */}
        <div className="lg:col-span-2">
          <div className={cardCls} style={cardShadow}>
            <h2 className="font-[var(--font-manrope)] text-sm font-bold text-[#1C2B1E] uppercase tracking-wider mb-5">
              {t('profile.personalInfo', lang)}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

              {/* First + Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    {t('profile.firstName', lang)} <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    placeholder="Ada"
                    className={inputCls(!!errors.firstName)}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    {t('profile.lastName', lang)} <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    placeholder="Lovelace"
                    className={inputCls(!!errors.lastName)}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Preferred name */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t('profile.preferredName', lang)}{' '}
                  <span className="font-normal text-gray-300">(optional)</span>
                </label>
                <input
                  {...register('preferredName')}
                  type="text"
                  placeholder="What should responders call you?"
                  className={inputCls(!!errors.preferredName)}
                />
                {errors.preferredName && (
                  <p className="text-xs text-red-500 mt-1">{errors.preferredName.message}</p>
                )}
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t('profile.dateOfBirth', lang)}
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className={inputCls(false)}
                />
              </div>

              {/* Biological sex */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t('profile.biologicalSex', lang)}
                </label>
                <select {...register('biologicalSex')} className={selectCls}>
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="intersex">Intersex</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              {/* Blood type + Primary language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    {t('profile.bloodType', lang)}
                  </label>
                  <select {...register('bloodType')} className={selectCls}>
                    <option value="">Select...</option>
                    {BLOOD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    {t('profile.primaryLanguage', lang)}
                  </label>
                  <select {...register('primaryLanguage')} className={selectCls}>
                    <option value="">Select language...</option>
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Organ donor toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      {...register('organDonor')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full transition-colors peer-checked:bg-[#4A7A50] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-4" />
                  </div>
                  <span className="text-sm text-[#1C2B1E] group-hover:text-[#4A7A50] transition-colors">
                    {t('profile.organDonorLabel', lang)}
                  </span>
                </label>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2 gap-3">
                <div className="flex-1">
                  {saveSuccess && (
                    <p className="text-sm text-[#4A7A50] font-medium">
                      {t('profile.saved', lang)}
                    </p>
                  )}
                  {saveError && (
                    <p className="text-sm text-red-500">{saveError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                  style={{ background: 'linear-gradient(145deg, #44664a, #7a9e7e)' }}
                >
                  {saving ? 'Saving…' : t('profile.saveChanges', lang)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Quick-Glance Health Icons ── */}
      <div className={`${cardCls} mt-4`} style={cardShadow}>
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="font-[var(--font-manrope)] text-sm font-bold text-[#1C2B1E] uppercase tracking-wider">
              {t('profile.quickGlance', lang)}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {t('profile.quickGlanceSubtitle', lang)}
            </p>
          </div>
          {iconsSaving && (
            <span className="text-xs text-gray-300 pt-1 flex-shrink-0">Saving…</span>
          )}
        </div>

        {selectedIcons.length === 5 && (
          <p className="text-xs text-amber-500 font-medium mt-2">
            Maximum 5 icons selected
          </p>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {QUICK_ICONS.map((icon) => {
            const isSelected = selectedIcons.includes(icon.key)
            const isDisabled = !isSelected && selectedIcons.length >= 5
            return (
              <button
                key={icon.key}
                type="button"
                onClick={() => toggleIcon(icon.key)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                className={[
                  'flex flex-col items-center justify-center gap-1 p-2 min-h-[4.5rem] rounded-2xl border-2 transition-all',
                  isSelected
                    ? 'border-[#4A7A50] bg-[#4A7A50]/8 shadow-sm'
                    : isDisabled
                      ? 'border-gray-100 bg-gray-50/60 opacity-40 cursor-not-allowed'
                      : 'border-gray-100 hover:border-[#4A7A50]/40 hover:bg-[#4A7A50]/4',
                ].join(' ')}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {icon.emoji}
                </span>
                <span
                  className={[
                    'text-xs font-medium text-center leading-tight break-words hyphens-auto w-full max-w-full',
                    isSelected ? 'text-[#4A7A50]' : 'text-[#1C2B1E]',
                  ].join(' ')}
                >
                  {t(`icon.${icon.key === 'directive' ? 'dnr' : icon.key}`, lang)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
