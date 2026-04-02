'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cfFetch } from '@/lib/api'
import { RecordCard } from './RecordCard'
import { SlideDrawer } from './SlideDrawer'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import {
  INPUT_CLS, INPUT_ERR_CLS, TEXTAREA_CLS,
  LABEL_CLS, TOGGLE_TRACK_CLS, SAVE_BTN_CLS, SAVE_BTN_STYLE, EMPTY_STATE_CLS,
} from './formStyles'

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

const schema = z.object({
  name: z.string().min(1, 'Full name is required'),
  relationship: z.string().optional(),
  phone: z.string().min(7, 'Phone number is required'),
  phoneAlt: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  canAccessJournal: z.boolean().optional(),
  showOnEmergencyProfile: z.boolean(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: '',
  relationship: '',
  phone: '',
  phoneAlt: '',
  email: '',
  canAccessJournal: false,
  showOnEmergencyProfile: true,
  notes: '',
}

interface ContactsTabProps {
  initialData?: EmergencyContact[]
}

export function ContactsTab({ initialData }: ContactsTabProps) {
  const { lang } = useLang()
  const [items, setItems] = useState<EmergencyContact[]>(
    initialData ? [...initialData].sort((a, b) => a.priority - b.priority) : []
  )
  const [loading, setLoading] = useState(!initialData)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EmergencyContact | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [relSelect, setRelSelect] = useState('')
  const [customRel, setCustomRel] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cfFetch('getEmergencyContacts')
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { emergencyContacts: EmergencyContact[] }
      const sorted = (json.emergencyContacts ?? []).sort((a, b) => a.priority - b.priority)
      setItems(sorted)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialData !== undefined) return
    void fetchItems()
  }, [fetchItems, initialData])

  function openAdd() {
    reset(DEFAULTS)
    setEditingItem(null)
    setSubmitError(null)
    setRelSelect('')
    setCustomRel('')
    setDrawerOpen(true)
  }

  function openEdit(item: EmergencyContact) {
    const isKnown = RELATIONSHIPS.some((r) => r.value === item.relationship)
    const sel = isKnown ? item.relationship : (item.relationship ? 'Other' : '')
    const custom = isKnown ? '' : (item.relationship ?? '')
    reset({
      name: item.name,
      relationship: item.relationship,
      phone: item.phone,
      phoneAlt: item.phoneAlt ?? '',
      email: item.email ?? '',
      canAccessJournal: false,
      showOnEmergencyProfile: item.showOnEmergencyProfile,
      notes: item.notes ?? '',
    })
    setRelSelect(sel)
    setCustomRel(custom)
    setEditingItem(item)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await cfFetch(`deleteEmergencyContact/${id}`, { method: 'DELETE' })
      await fetchItems()
    } catch {
      // silent
    } finally {
      setDeletingId(null)
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const cleanData = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      )

      if (editingItem) {
        const res = await cfFetch(`updateEmergencyContact/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(cleanData),
        })
        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({})) as { issues?: { message: string }[]; error?: string }
          setSubmitError(
            errorBody.issues
              ? errorBody.issues.map((i) => i.message).join(', ')
              : `Error ${res.status}: ${errorBody.error ?? 'Failed to save contact. Please try again.'}`
          )
          return
        }
      } else {
        const res = await cfFetch('createEmergencyContact', {
          method: 'POST',
          body: JSON.stringify(cleanData),
        })
        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({})) as { issues?: { message: string }[]; error?: string }
          console.error('createEmergencyContact failed:', res.status, errorBody)
          setSubmitError(
            errorBody.issues
              ? errorBody.issues.map((i) => i.message).join(', ')
              : `Error ${res.status}: ${errorBody.error ?? 'Failed to save contact. Please try again.'}`
          )
          return
        }
      }

      reset(DEFAULTS)
      setRelSelect('')
      setCustomRel('')
      setSubmitError(null)
      setDrawerOpen(false)
      await fetchItems()
    } catch (err) {
      console.error('Emergency contact submit error:', err)
      setSubmitError('Unexpected error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDrawerChange(open: boolean) {
    setDrawerOpen(open)
    if (!open) setEditingItem(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-5 h-5 border-2 border-[#4A7A50] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className={EMPTY_STATE_CLS}>
            <p className="text-3xl mb-3">📞</p>
            <p className="text-sm font-medium text-[#1C2B1E] mb-1">{t('emergency.noContacts', lang)}</p>
            <p className="text-xs text-gray-400 mb-4">Add people who should be contacted in an emergency</p>
            <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
              {t('emergency.addContact', lang)}
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
                + {t('common.add', lang)}
              </button>
            </div>
            {items.map((item) => (
              <RecordCard
                key={item.id}
                title={item.name}
                subtitle={`${item.relationship} · ${item.phone}`}
                badge={
                  item.priority === 1 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#4A7A50]/10 text-[#4A7A50]">
                      {t('common.primary', lang)}
                    </span>
                  ) : undefined
                }
                onEdit={() => openEdit(item)}
                onDelete={() => void handleDelete(item.id)}
                isDeleting={deletingId === item.id}
              />
            ))}
          </>
        )}
      </div>

      <SlideDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerChange}
        title={editingItem ? `${t('common.edit', lang)} ${t('emergency.contacts', lang)}` : t('emergency.addContact', lang)}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className={LABEL_CLS}>{t('contact.fullName', lang)} <span className="text-red-400">*</span></label>
            <input
              {...register('name')}
              type="text"
              placeholder={t('contact.namePlaceholder', lang)}
              className={`${INPUT_CLS} ${errors.name ? INPUT_ERR_CLS : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>{t('contact.relationship', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <select
              value={relSelect}
              onChange={(e) => {
                const val = e.target.value
                setRelSelect(val)
                if (val !== 'Other') {
                  setCustomRel('')
                  setValue('relationship', val)
                } else {
                  setValue('relationship', customRel)
                }
              }}
              className={INPUT_CLS}
            >
              <option value="">{t('contact.selectRelationship', lang)}</option>
              {RELATIONSHIPS.map((rel) => (
                <option key={rel.value} value={rel.value}>{t(rel.labelKey, lang)}</option>
              ))}
            </select>
            {relSelect === 'Other' && (
              <input
                type="text"
                value={customRel}
                onChange={(e) => {
                  setCustomRel(e.target.value)
                  setValue('relationship', e.target.value)
                }}
                placeholder="Describe the relationship"
                className={`${INPUT_CLS} mt-2`}
              />
            )}
          </div>

          <div>
            <label className={LABEL_CLS}>{t('contact.phone', lang)} <span className="text-red-400">*</span></label>
            <input
              {...register('phone')}
              type="tel"
              placeholder={t('contact.phonePlaceholder', lang)}
              className={`${INPUT_CLS} ${errors.phone ? INPUT_ERR_CLS : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>{t('contact.altPhone', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <input {...register('phoneAlt')} type="tel" placeholder="+1 555 000 0001" className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Email <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <input
              {...register('email')}
              type="email"
              placeholder="contact@example.com"
              className={`${INPUT_CLS} ${errors.email ? INPUT_ERR_CLS : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex-shrink-0">
              <input type="checkbox" {...register('showOnEmergencyProfile')} className="sr-only peer" />
              <div className={TOGGLE_TRACK_CLS} />
            </div>
            <span className="text-sm text-[#1C2B1E] group-hover:text-[#4A7A50] transition-colors">
              {t('common.showOnEmergency', lang)}
            </span>
          </label>

          <div>
            <label className={LABEL_CLS}>{t('emergency.notes', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <textarea {...register('notes')} rows={2} placeholder={t('contact.notesPlaceholder', lang)} className={TEXTAREA_CLS} />
          </div>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button type="submit" disabled={submitting} className={SAVE_BTN_CLS} style={SAVE_BTN_STYLE}>
            {submitting ? 'Saving…' : editingItem ? t('profile.saveChanges', lang) : t('emergency.addContact', lang)}
          </button>
        </form>
      </SlideDrawer>
    </>
  )
}
