'use client'

import { useState, useEffect, useCallback } from 'react'
import { cfFetch } from '@/lib/api'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { SAVE_BTN_STYLE } from './formStyles'
import { PhoneInput } from '@/components/ui/PhoneInput'

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

export interface PrimaryPhysician {
  id: string
  name: string
  specialty: string
  country: string
  city: string
  phone: string
  email?: string
  language?: string
  notes?: string
  showOnEmergencyProfile: boolean
}

interface FormState {
  name: string
  specialty: string
  country: string
  city: string
  phone: string
  email: string
  language: string
  notes: string
  showOnEmergencyProfile: boolean
}

const DEFAULT_FORM: FormState = {
  name: '',
  specialty: '',
  country: '',
  city: '',
  phone: '',
  email: '',
  language: '',
  notes: '',
  showOnEmergencyProfile: true,
}

const INPUT_CLS =
  'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50] focus:ring-1 focus:ring-[#4A7A50]/20'

interface PhysicianTabProps {
  initialData?: PrimaryPhysician | null
}

export function PhysicianTab({ initialData }: PhysicianTabProps) {
  const { lang } = useLang()
  const [physician, setPhysician] = useState<PrimaryPhysician | null>(
    initialData !== undefined ? initialData : null
  )
  const [loading, setLoading] = useState(initialData === undefined)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchPhysician = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cfFetch('getPrimaryPhysician')
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { physician: PrimaryPhysician | null }
      setPhysician(json.physician)
    } catch {
      setPhysician(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialData !== undefined) return
    void fetchPhysician()
  }, [fetchPhysician, initialData])

  function openAdd() {
    setForm(DEFAULT_FORM)
    setSaveError(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openEdit() {
    if (!physician) return
    setForm({
      name: physician.name,
      specialty: physician.specialty,
      country: physician.country,
      city: physician.city,
      phone: physician.phone,
      email: physician.email ?? '',
      language: physician.language ?? '',
      notes: physician.notes ?? '',
      showOnEmergencyProfile: physician.showOnEmergencyProfile,
    })
    setSaveError(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!form.name || !form.specialty || !form.country || !form.city || !form.phone) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await cfFetch('upsertPrimaryPhysician', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          specialty: form.specialty,
          country: form.country,
          city: form.city,
          phone: form.phone,
          email: form.email || undefined,
          language: form.language || undefined,
          notes: form.notes || undefined,
          showOnEmergencyProfile: form.showOnEmergencyProfile,
        }),
      })
      if (!res.ok) throw new Error()
      setShowForm(false)
      await fetchPhysician()
    } catch {
      setSaveError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await cfFetch('deletePrimaryPhysician', { method: 'DELETE' })
      setPhysician(null)
      setConfirmDelete(false)
    } catch {
      setPhysician(null)
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-5 h-5 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add / Edit form */}
      {showForm && (
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 8px rgba(28,43,30,0.08)', border: '2px solid #4A7A50' }}
        >
          <h3 className="font-semibold text-sm text-[#1C2B1E] mb-4">
            {physician ? t('form.edit', lang as Lang) : t('physician.addPhysician', lang as Lang)}
          </h3>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('physician.fullName', lang as Lang)} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={t('physician.namePlaceholder', lang as Lang)}
                className={INPUT_CLS}
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('physician.specialty', lang as Lang)} *
              </label>
              <input
                type="text"
                value={form.specialty}
                onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
                placeholder={t('physician.specialtyPlaceholder', lang as Lang)}
                className={INPUT_CLS}
              />
            </div>

            {/* Country + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('physician.country', lang as Lang)} *
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                  placeholder="Costa Rica"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('physician.city', lang as Lang)} *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  placeholder="San José"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('physician.phone', lang as Lang)} *
              </label>
              <PhoneInput
                value={form.phone}
                onChange={val => setForm(p => ({ ...p, phone: val }))}
                placeholder="88887777"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Email{' '}
                <span className="text-gray-400 font-normal">
                  ({t('physician.emailNote', lang as Lang)})
                </span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="dr.martinez@clinic.com"
                className={INPUT_CLS}
              />
            </div>

            {/* Language */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('physician.language', lang as Lang)}
              </label>
              <select
                value={form.language}
                onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                className={`${INPUT_CLS} bg-white`}
              >
                <option value="">{t('lang.selectLanguage', lang as Lang)}...</option>
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('emergency.notes', lang as Lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang as Lang)}</span>
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="e.g. Clínica Santa Fe · Mon–Fri 8am–5pm"
                className={INPUT_CLS}
              />
            </div>

            {/* Show on emergency */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.showOnEmergencyProfile}
                onChange={e => setForm(p => ({ ...p, showOnEmergencyProfile: e.target.checked }))}
                className="accent-[#4A7A50] w-4 h-4"
              />
              <span className="text-gray-700">{t('common.showOnEmergency', lang as Lang)}</span>
            </label>

            {saveError && <p className="text-xs text-red-500">{saveError}</p>}

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || !form.name || !form.specialty || !form.country || !form.city || !form.phone}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                style={SAVE_BTN_STYLE}
              >
                {saving ? '...' : t('common.save', lang as Lang)}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', lang as Lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Physician card or empty state */}
      {!showForm && !physician && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-3xl mb-3">🩺</p>
          <p className="text-sm text-gray-500 mb-4">
            {t('physician.noPhysician', lang as Lang)}
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-[#C8DEC4] text-[#4A7A50] text-sm font-medium hover:bg-[#E8F2E6] transition-colors"
          >
            + {t('physician.addPhysician', lang as Lang)}
          </button>
        </div>
      )}

      {!showForm && physician && (
        <div
          className="bg-white rounded-2xl overflow-hidden border border-[#F0F4EE]"
          style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
        >
          {/* Card header */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-[#1C2B1E]">
                    {physician.name}
                  </p>
                  {physician.specialty && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E8F2E6] text-[#4A7A50] text-xs font-medium">
                      {physician.specialty}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {physician.city}, {physician.country}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={openEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A7A50] border border-[#4A7A50]/30 hover:bg-[#E8F2E6] transition-colors"
                >
                  ✏️ {t('form.edit', lang as Lang)}
                </button>
                {confirmDelete ? (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      {deleting ? '...' : t('form.confirm', lang as Lang)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {t('common.cancel', lang as Lang)}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    🗑️ {t('form.delete', lang as Lang)}
                  </button>
                )}
              </div>
            </div>

            {/* Contact details */}
            <div className="mt-3 space-y-2">
              <a
                href={`tel:${physician.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={SAVE_BTN_STYLE}
              >
                📞 {physician.phone}
              </a>
              {physician.email && (
                <div>
                  <a
                    href={`mailto:${physician.email}`}
                    className="text-xs text-[#4A7A50] hover:underline"
                  >
                    ✉️ {physician.email}
                  </a>
                </div>
              )}
              {physician.notes && (
                <p className="text-xs text-gray-500">{physician.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
