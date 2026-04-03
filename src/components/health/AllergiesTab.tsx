'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { cfFetch } from '@/lib/api'
import { CatalogSearchInput } from './CatalogSearchInput'
import { RecordCardNew } from './RecordCardNew'

// ─── Types ───────────────────────────────────────────

interface Allergy {
  id: string
  allergen: string
  allergenType: string
  severity: string
  reaction: string
  isCritical: boolean
  epipenPrescribed?: boolean
  showOnEmergencyProfile: boolean
  notes: string
  catalogRef?: string | null
}

interface FormState {
  allergen: string
  catalogRef: string | null
  allergenType: string
  severity: string
  reaction: string
  epipenPrescribed: boolean
  showOnEmergencyProfile: boolean
  notes: string
  typeFromCatalog: boolean
}

// ─── Constants ───────────────────────────────────────

const SEVERITY_COLORS: Record<string, { bg: string; color: string }> = {
  mild: { bg: '#F3F4F6', color: '#6B7280' },
  moderate: { bg: '#FDE68A', color: '#92400E' },
  severe: { bg: '#FED7AA', color: '#9A3412' },
  life_threatening: { bg: '#FEE2E2', color: '#991B1B' },
}

const SEVERITY_TYPES = ['mild', 'moderate', 'severe', 'life_threatening']
const ALLERGY_TYPES = ['drug', 'food', 'environmental', 'contact', 'other']

const DEFAULT_FORM: FormState = {
  allergen: '',
  catalogRef: null,
  allergenType: '',
  severity: '',
  reaction: '',
  epipenPrescribed: false,
  showOnEmergencyProfile: true,
  notes: '',
  typeFromCatalog: false,
}

const SAVE_BTN_STYLE = {
  background: 'linear-gradient(145deg,#44664a,#7a9e7e)',
}

// ─── Component ───────────────────────────────────────

export function AllergiesTab() {
  const { lang } = useLang()
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await cfFetch('getAllergies')
      const data = await res.json() as { allergies?: (Allergy & { allergyId?: string; docId?: string })[] }
      const allergies = (data.allergies ?? []).map(a => ({
        ...a,
        id: a.id ?? a.allergyId ?? a.docId ?? '',
      }))
      setAllergies(allergies)
    } catch (err) {
      console.error('AllergiesTab load error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleCatalogSelect(entry: {
    id: string | null
    name: string
    allergenType?: string
    isCritical?: boolean
  }) {
    setForm(prev => ({
      ...prev,
      allergen: entry.name,
      catalogRef: entry.id,
      allergenType: entry.allergenType ?? prev.allergenType,
      typeFromCatalog: !!entry.allergenType,
    }))
  }

  function startEdit(allergy: Allergy) {
    setForm({
      allergen: allergy.allergen ?? '',
      catalogRef: allergy.catalogRef ?? null,
      allergenType: allergy.allergenType ?? '',
      severity: allergy.severity ?? '',
      reaction: allergy.reaction ?? '',
      epipenPrescribed: allergy.epipenPrescribed ?? false,
      showOnEmergencyProfile: allergy.showOnEmergencyProfile ?? true,
      notes: allergy.notes ?? '',
      typeFromCatalog: false,
    })
    setEditingId(allergy.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!form.allergen || !form.severity) return
    setSaving(true)
    try {
      const payload = {
        allergen: form.allergen,
        severity: form.severity,
        allergenType: form.allergenType || '',
        reaction: form.reaction || '',
        epipenPrescribed: form.epipenPrescribed ?? false,
        showOnEmergencyProfile: form.showOnEmergencyProfile ?? true,
        notes: form.notes || '',
        isCritical: form.severity === 'life_threatening',
        catalogRef: form.catalogRef ?? null,
      }

      if (editingId) {
        const res = await cfFetch('updateAllergy', {
          method: 'PUT',
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        if (res.ok) {
          setAllergies(prev =>
            prev.map(a => (a.id === editingId ? { ...a, ...payload, id: editingId } : a))
          )
          setEditingId(null)
          setShowForm(false)
          setForm(DEFAULT_FORM)
        }
      } else {
        const res = await cfFetch('createAllergy', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const data = await res.json() as { id?: string; allergyId?: string; docId?: string }
          const newId = data.id ?? data.allergyId ?? data.docId ?? ''
          setAllergies(prev => [...prev, { ...payload, id: newId } as Allergy])
          setShowForm(false)
          setForm(DEFAULT_FORM)
        }
      }
    } catch (err) {
      console.error('Allergy save error:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!id) {
      console.error('Delete called with no id')
      return
    }
    setDeleting(id)
    try {
      const res = await cfFetch('deleteAllergy', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setAllergies(prev => prev.filter(a => a.id !== id))
      } else {
        console.error('deleteAllergy failed:', res.status)
      }
    } catch (err) {
      console.error('deleteAllergy error:', err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add / Edit form */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => {
            setForm(DEFAULT_FORM)
            setEditingId(null)
            setShowForm(true)
          }}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[#C8DEC4] text-[#4A7A50] text-sm font-medium hover:bg-[#E8F2E6] transition-colors"
        >
          + {t('emergency.addAllergy', lang)}
        </button>
      ) : (
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 8px rgba(28,43,30,0.08)', border: '2px solid #4A7A50' }}
        >
          <h3 className="font-semibold text-sm text-[#1C2B1E] mb-4">
            {editingId ? t('form.edit', lang) : t('emergency.addAllergy', lang)}
          </h3>

          <div className="space-y-3">
            {/* Allergen search */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('allergy.allergen', lang)} *
              </label>
              <CatalogSearchInput
                key={editingId ?? 'new-allergy'}
                type="allergen"
                lang={lang}
                placeholder={t('allergy.allergenPlaceholder', lang)}
                value={form.allergen}
                onSelect={handleCatalogSelect}
                disabled={!!editingId}
              />
            </div>

            {/* Type + Severity row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('allergy.type', lang)}
                </label>
                <select
                  value={form.allergenType}
                  disabled={form.typeFromCatalog}
                  onChange={e => setForm(p => ({ ...p, allergenType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50] disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">{t('allergy.selectType', lang)}</option>
                  {ALLERGY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {t(`allergy.type.${type}`, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('allergy.severity', lang)} *
                </label>
                <select
                  value={form.severity}
                  onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
                >
                  <option value="">{t('allergy.selectSeverity', lang)}</option>
                  {SEVERITY_TYPES.map(s => (
                    <option key={s} value={s}>
                      {t(`allergy.severity.${s}`, lang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reaction */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('allergy.reaction', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <input
                type="text"
                value={form.reaction}
                onChange={e => setForm(p => ({ ...p, reaction: e.target.value }))}
                placeholder={t('allergy.reactionPlaceholder', lang)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.epipenPrescribed}
                  onChange={e => setForm(p => ({ ...p, epipenPrescribed: e.target.checked }))}
                  className="accent-[#4A7A50] w-4 h-4"
                />
                <span className="text-gray-700">{t('allergy.epipen', lang)}</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showOnEmergencyProfile}
                  onChange={e =>
                    setForm(p => ({ ...p, showOnEmergencyProfile: e.target.checked }))
                  }
                  className="accent-[#4A7A50] w-4 h-4"
                />
                <span className="text-gray-700">{t('common.showOnEmergency', lang)}</span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('emergency.notes', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder={t('form.additionalDetails', lang)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {/* Form buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || !form.allergen || !form.severity}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                style={SAVE_BTN_STYLE}
              >
                {saving ? '...' : t('common.save', lang)}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setForm(DEFAULT_FORM)
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel', lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse h-16"
              style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
            />
          ))}
        </div>
      ) : allergies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">🚨</p>
          <p className="text-gray-500 text-sm">{t('emergency.noAllergies', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allergies.map(allergy => {
            const sevColor =
              SEVERITY_COLORS[allergy.severity] ?? SEVERITY_COLORS['mild']

            return (
              <RecordCardNew
                key={allergy.id}
                lang={lang}
                title={allergy.allergen}
                subtitle={[
                  allergy.allergenType
                    ? t(`allergy.type.${allergy.allergenType}`, lang)
                    : '',
                  allergy.severity
                    ? t(`allergy.severity.${allergy.severity}`, lang)
                    : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
                badge={{
                  label: t(`allergy.severity.${allergy.severity}`, lang),
                  bg: sevColor.bg,
                  color: sevColor.color,
                }}
                isCritical={allergy.isCritical}
                onEdit={() => startEdit(allergy)}
                onDelete={() => void handleDelete(allergy.id)}
                isDeleting={deleting === allergy.id}
              >
                {allergy.reaction && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">{t('allergy.reaction', lang)}:</span>{' '}
                    {allergy.reaction}
                  </p>
                )}
                {allergy.epipenPrescribed && (
                  <p className="text-xs text-red-600 font-medium">
                    💉 {t('allergy.epipen', lang)}
                  </p>
                )}
                {allergy.notes && (
                  <p className="text-xs text-gray-500">{allergy.notes}</p>
                )}
              </RecordCardNew>
            )
          })}
        </div>
      )}
    </div>
  )
}
