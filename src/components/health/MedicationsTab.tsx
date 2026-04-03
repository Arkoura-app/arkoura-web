'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { cfFetch } from '@/lib/api'
import { CatalogSearchInput } from './CatalogSearchInput'
import { RecordCardNew } from './RecordCardNew'

// ─── Types ───────────────────────────────────────────

interface Medication {
  id: string
  name: string
  genericName: string
  dose: string
  frequency: string
  route: string
  isCritical: boolean
  showOnEmergencyProfile: boolean
  notes: string
  catalogRef?: string | null
}

interface FormState {
  name: string
  catalogRef: string | null
  genericName: string
  dose: string
  frequency: string
  route: string
  isCritical: boolean
  showOnEmergencyProfile: boolean
  notes: string
  nameFromCatalog: boolean
}

// ─── Constants ───────────────────────────────────────

const ROUTE_OPTIONS = ['oral', 'topical', 'inhaled', 'injected', 'sublingual', 'other']

const DEFAULT_FORM: FormState = {
  name: '',
  catalogRef: null,
  genericName: '',
  dose: '',
  frequency: '',
  route: '',
  isCritical: false,
  showOnEmergencyProfile: true,
  notes: '',
  nameFromCatalog: false,
}

const SAVE_BTN_STYLE = {
  background: 'linear-gradient(145deg,#44664a,#7a9e7e)',
}

// ─── Component ───────────────────────────────────────

export function MedicationsTab() {
  const { lang } = useLang()
  const [medications, setMedications] = useState<Medication[]>([])
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
      const res = await cfFetch('getMedications')
      const data = await res.json()
      setMedications(data.medications ?? [])
    } catch (err) {
      console.error('MedicationsTab load error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleCatalogSelect(entry: {
    id: string | null
    name: string
    genericName?: string
    route?: string
    isCritical?: boolean
  }) {
    setForm(prev => ({
      ...prev,
      name: entry.name,
      catalogRef: entry.id,
      genericName: entry.genericName ?? prev.genericName,
      route: entry.route ?? prev.route,
      isCritical: entry.isCritical ?? prev.isCritical,
    }))
  }

  function startEdit(med: Medication) {
    setForm({
      name: med.name ?? '',
      catalogRef: med.catalogRef ?? null,
      genericName: med.genericName ?? '',
      dose: med.dose ?? '',
      frequency: med.frequency ?? '',
      route: med.route ?? 'oral',
      isCritical: med.isCritical ?? false,
      showOnEmergencyProfile: med.showOnEmergencyProfile ?? true,
      notes: med.notes ?? '',
      nameFromCatalog: false,
    })
    setEditingId(med.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        catalogRef: form.catalogRef,
        genericName: form.genericName,
        dose: form.dose,
        frequency: form.frequency,
        route: form.route,
        isCritical: form.isCritical,
        showOnEmergencyProfile: form.showOnEmergencyProfile,
        notes: form.notes,
      }

      if (editingId) {
        const res = await cfFetch('updateMedication', {
          method: 'PUT',
          body: JSON.stringify({ id: editingId, ...payload }),
        })
        if (res.ok) {
          setMedications(prev =>
            prev.map(m => (m.id === editingId ? { ...m, ...payload, id: editingId } : m))
          )
          setEditingId(null)
          setShowForm(false)
          setForm(DEFAULT_FORM)
        }
      } else {
        const res = await cfFetch('createMedication', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const data = await res.json() as { id?: string; medicationId?: string; docId?: string }
          const newId = data.id ?? data.medicationId ?? data.docId ?? ''
          setMedications(prev => [...prev, { ...payload, id: newId } as Medication])
          setShowForm(false)
          setForm(DEFAULT_FORM)
        }
      }
    } catch (err) {
      console.error('Medication save error:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!id) {
      console.error('handleDelete called with undefined id')
      return
    }
    setDeleting(id)
    try {
      await cfFetch('deleteMedication', { method: 'DELETE', body: JSON.stringify({ id }) })
      setMedications(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Medication delete error:', err)
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
          + {t('emergency.addMedication', lang)}
        </button>
      ) : (
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 8px rgba(28,43,30,0.08)', border: '2px solid #4A7A50' }}
        >
          <h3 className="font-semibold text-sm text-[#1C2B1E] mb-4">
            {editingId ? t('form.edit', lang) : t('emergency.addMedication', lang)}
          </h3>

          <div className="space-y-3">
            {/* Medication search */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('medication.name', lang)} *
              </label>
              <CatalogSearchInput
                key={editingId ?? 'new-medication'}
                type="medication"
                lang={lang}
                placeholder={t('medication.namePlaceholder', lang)}
                value={form.name}
                onSelect={handleCatalogSelect}
              />
            </div>

            {/* Generic name */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('medication.genericName', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <input
                type="text"
                value={form.genericName}
                onChange={e => setForm(p => ({ ...p, genericName: e.target.value }))}
                placeholder="e.g. metformin hydrochloride"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {/* Dose + Frequency row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('medication.dose', lang)}
                </label>
                <input
                  type="text"
                  value={form.dose}
                  onChange={e => setForm(p => ({ ...p, dose: e.target.value }))}
                  placeholder={t('medication.dosePlaceholder', lang)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  {t('medication.frequency', lang)}
                </label>
                <input
                  type="text"
                  value={form.frequency}
                  onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                  placeholder={t('medication.frequencyPlaceholder', lang)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
                />
              </div>
            </div>

            {/* Route */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('medication.route', lang)}
              </label>
              <select
                value={form.route}
                onChange={e => setForm(p => ({ ...p, route: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              >
                <option value="">{t('medication.selectRoute', lang)}</option>
                {ROUTE_OPTIONS.map(r => (
                  <option key={r} value={r}>
                    {t(`medication.route.${r}`, lang)}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isCritical}
                  onChange={e => setForm(p => ({ ...p, isCritical: e.target.checked }))}
                  className="accent-[#4A7A50] w-4 h-4"
                />
                <span className="text-gray-700">
                  {t('emergency.critical', lang)}
                </span>
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
                disabled={saving || !form.name}
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
      ) : medications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">💊</p>
          <p className="text-gray-500 text-sm">{t('emergency.noMedications', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {medications.map(med => (
            <RecordCardNew
              key={med.id}
              lang={lang}
              title={med.name}
              subtitle={[med.dose, med.frequency ? med.frequency : '']
                .filter(Boolean)
                .join(' · ')}
              isCritical={med.isCritical}
              onEdit={() => startEdit(med)}
              onDelete={() => void handleDelete(med.id)}
              isDeleting={deleting === med.id}
            >
              {med.genericName && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{t('medication.genericName', lang)}:</span>{' '}
                  {med.genericName}
                </p>
              )}
              {med.route && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{t('medication.route', lang)}:</span>{' '}
                  {t(`medication.route.${med.route}`, lang)}
                </p>
              )}
              {med.notes && (
                <p className="text-xs text-gray-500">{med.notes}</p>
              )}
            </RecordCardNew>
          ))}
        </div>
      )}
    </div>
  )
}
