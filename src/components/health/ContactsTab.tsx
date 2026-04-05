'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { translateRelationship } from '@/lib/relationships'
import { cfFetch } from '@/lib/api'
import { RecordCardNew } from './RecordCardNew'
import { PhoneInput } from '@/components/ui/PhoneInput'

// ─── Types ───────────────────────────────────────────

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  phoneAlt?: string
  email?: string
  priority: number
  showOnEmergencyProfile: boolean
  notes?: string
}

interface FormState {
  name: string
  relationship: string
  customRelationship: string
  relSelect: string
  phone: string
  phoneAlt: string
  email: string
  showOnEmergencyProfile: boolean
  notes: string
}

// ─── Constants ───────────────────────────────────────

const RELATIONSHIPS = [
  { value: 'Spouse / Partner', labelKey: 'contact.rel.spouse' },
  { value: 'Parent', labelKey: 'contact.rel.parent' },
  { value: 'Child', labelKey: 'contact.rel.child' },
  { value: 'Sibling', labelKey: 'contact.rel.sibling' },
  { value: 'Grandparent', labelKey: 'contact.rel.grandparent' },
  { value: 'Aunt / Uncle', labelKey: 'contact.rel.aunt_uncle' },
  { value: 'Cousin', labelKey: 'contact.rel.cousin' },
  { value: 'Friend', labelKey: 'contact.rel.friend' },
  { value: 'Caretaker', labelKey: 'contact.rel.caretaker' },
  { value: 'Legal Guardian', labelKey: 'contact.rel.legal_guardian' },
  { value: 'Neighbour', labelKey: 'contact.rel.neighbour' },
  { value: 'Colleague', labelKey: 'contact.rel.colleague' },
  { value: 'Doctor', labelKey: 'contact.rel.doctor' },
  { value: 'Other', labelKey: 'contact.rel.other' },
]

const DEFAULT_FORM: FormState = {
  name: '',
  relationship: '',
  customRelationship: '',
  relSelect: '',
  phone: '',
  phoneAlt: '',
  email: '',
  showOnEmergencyProfile: true,
  notes: '',
}

const SAVE_BTN_STYLE = {
  background: 'linear-gradient(145deg,#44664a,#7a9e7e)',
}

// ─── Component ───────────────────────────────────────

export function ContactsTab() {
  const { lang } = useLang()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await cfFetch('getEmergencyContacts')
      const data = await res.json()
      const sorted = (data.emergencyContacts ?? []).sort(
        (a: EmergencyContact, b: EmergencyContact) => a.priority - b.priority
      )
      setContacts(sorted)
    } catch (err) {
      console.error('ContactsTab load error:', err)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(contact: EmergencyContact) {
    const isKnown = RELATIONSHIPS.some(r => r.value === contact.relationship)
    const relSelect = isKnown ? contact.relationship : contact.relationship ? 'Other' : ''
    const customRelationship = isKnown ? '' : contact.relationship ?? ''
    setForm({
      name: contact.name,
      relationship: contact.relationship,
      customRelationship,
      relSelect,
      phone: contact.phone,
      phoneAlt: contact.phoneAlt ?? '',
      email: contact.email ?? '',
      showOnEmergencyProfile: contact.showOnEmergencyProfile,
      notes: contact.notes ?? '',
    })
    setEditingId(contact.id)
    setSaveError(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRelSelect(value: string) {
    if (value === 'Other') {
      setForm(p => ({
        ...p,
        relSelect: value,
        relationship: p.customRelationship,
      }))
    } else {
      setForm(p => ({
        ...p,
        relSelect: value,
        relationship: value,
        customRelationship: '',
      }))
    }
  }

  async function handleSave() {
    if (!form.name || !form.phone) return
    setSaving(true)
    setSaveError(null)
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        relationship: form.relationship || undefined,
        phone: form.phone,
        showOnEmergencyProfile: form.showOnEmergencyProfile,
      }
      if (form.phoneAlt) payload.phoneAlt = form.phoneAlt
      if (form.email) payload.email = form.email
      if (form.notes) payload.notes = form.notes

      if (editingId) {
        const res = await cfFetch(`updateEmergencyContact/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string }
          setSaveError(err.error ?? 'Failed to save. Please try again.')
          return
        }
        setContacts(prev =>
          prev.map(c =>
            c.id === editingId
              ? {
                  ...c,
                  name: form.name,
                  relationship: form.relationship,
                  phone: form.phone,
                  phoneAlt: form.phoneAlt || undefined,
                  email: form.email || undefined,
                  showOnEmergencyProfile: form.showOnEmergencyProfile,
                  notes: form.notes || undefined,
                }
              : c
          )
        )
      } else {
        const res = await cfFetch('createEmergencyContact', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string }
          setSaveError(err.error ?? 'Failed to save. Please try again.')
          return
        }
        const data = await res.json()
        setContacts(prev => [
          ...prev,
          {
            id: data.id,
            name: form.name,
            relationship: form.relationship,
            phone: form.phone,
            phoneAlt: form.phoneAlt || undefined,
            email: form.email || undefined,
            priority: data.priority ?? prev.length + 1,
            showOnEmergencyProfile: form.showOnEmergencyProfile,
            notes: form.notes || undefined,
          },
        ])
      }

      setForm(DEFAULT_FORM)
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      console.error('Contact save error:', err)
      setSaveError('Unexpected error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await cfFetch(`deleteEmergencyContact/${id}`, { method: 'DELETE' })
      setContacts(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Contact delete error:', err)
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
            setSaveError(null)
            setShowForm(true)
          }}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-[#C8DEC4] text-[#4A7A50] text-sm font-medium hover:bg-[#E8F2E6] transition-colors"
        >
          + {t('emergency.addContact', lang)}
        </button>
      ) : (
        <div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 8px rgba(28,43,30,0.08)', border: '2px solid #4A7A50' }}
        >
          <h3 className="font-semibold text-sm text-[#1C2B1E] mb-4">
            {editingId ? t('form.edit', lang) : t('emergency.addContact', lang)}
          </h3>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('contact.fullName', lang)} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={t('contact.namePlaceholder', lang)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('contact.relationship', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <select
                value={form.relSelect}
                onChange={e => handleRelSelect(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              >
                <option value="">{t('contact.selectRelationship', lang)}</option>
                {RELATIONSHIPS.map(rel => (
                  <option key={rel.value} value={rel.value}>
                    {t(rel.labelKey, lang)}
                  </option>
                ))}
              </select>
              {form.relSelect === 'Other' && (
                <input
                  type="text"
                  value={form.customRelationship}
                  onChange={e =>
                    setForm(p => ({
                      ...p,
                      customRelationship: e.target.value,
                      relationship: e.target.value,
                    }))
                  }
                  placeholder="Describe the relationship"
                  className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
                />
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('contact.phone', lang)} *
              </label>
              <PhoneInput
                value={form.phone}
                onChange={val => setForm(p => ({ ...p, phone: val }))}
                placeholder="88887777"
              />
            </div>

            {/* Alt phone */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('contact.altPhone', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <PhoneInput
                value={form.phoneAlt}
                onChange={val => setForm(p => ({ ...p, phoneAlt: val }))}
                placeholder="88887777"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t('auth.email', lang)}{' '}
                <span className="text-gray-400">{t('form.optional', lang)}</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="contact@example.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {/* Show on emergency toggle */}
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
                placeholder={t('contact.notesPlaceholder', lang)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
              />
            </div>

            {saveError && <p className="text-xs text-red-500">{saveError}</p>}

            {/* Form buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || !form.name || !form.phone}
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
                  setSaveError(null)
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
      ) : contacts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-3">📞</p>
          <p className="text-gray-500 text-sm">{t('emergency.noContacts', lang)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <RecordCardNew
              key={contact.id}
              title={contact.name}
              subtitle={translateRelationship(contact.relationship, lang)}
              badge={
                contact.priority === 1
                  ? {
                      label: t('common.primary', lang),
                      bg: 'rgba(74,122,80,0.1)',
                      color: '#4A7A50',
                    }
                  : undefined
              }
              onEdit={() => startEdit(contact)}
              onDelete={() => void handleDelete(contact.id)}
              isDeleting={deleting === contact.id}
            >
              <a
                href={`tel:${contact.phone}`}
                className="text-xs text-[#4A7A50] font-medium hover:underline"
                onClick={e => e.stopPropagation()}
              >
                📞 {contact.phone}
              </a>
              {contact.phoneAlt && (
                <a
                  href={`tel:${contact.phoneAlt}`}
                  className="block text-xs text-gray-500 hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  📞 {contact.phoneAlt}
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-xs text-gray-500 hover:underline"
                  onClick={e => e.stopPropagation()}
                >
                  ✉️ {contact.email}
                </a>
              )}
              {contact.notes && (
                <p className="text-xs text-gray-500">{contact.notes}</p>
              )}
            </RecordCardNew>
          ))}
        </div>
      )}
    </div>
  )
}
