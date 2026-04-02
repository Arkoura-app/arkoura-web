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
  INPUT_CLS, INPUT_ERR_CLS, TEXTAREA_CLS, SELECT_CLS,
  LABEL_CLS, TOGGLE_TRACK_CLS, SAVE_BTN_CLS, SAVE_BTN_STYLE, EMPTY_STATE_CLS,
} from './formStyles'

export interface Medication {
  id: string
  name: string
  genericName?: string
  dose?: string
  frequency?: string
  route?: string
  isCritical: boolean
  showOnEmergencyProfile: boolean
  purpose?: string
  notes?: string
}

const schema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  genericName: z.string().optional(),
  dose: z.string().optional(),
  frequency: z.string().optional(),
  route: z.string().optional(),
  isCritical: z.boolean(),
  showOnEmergencyProfile: z.boolean(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: '',
  genericName: '',
  dose: '',
  frequency: '',
  route: '',
  isCritical: false,
  showOnEmergencyProfile: true,
  purpose: '',
  notes: '',
}

interface MedicationsTabProps {
  initialData?: Medication[]
}

export function MedicationsTab({ initialData }: MedicationsTabProps) {
  const { lang } = useLang()
  const [items, setItems] = useState<Medication[]>(initialData ?? [])
  const [loading, setLoading] = useState(!initialData)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Medication | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await cfFetch('getMedications')
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { medications: Medication[] }
      setItems(json.medications ?? [])
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
    setDrawerOpen(true)
  }

  function openEdit(item: Medication) {
    reset({
      name: item.name,
      genericName: item.genericName ?? '',
      dose: item.dose ?? '',
      frequency: item.frequency ?? '',
      route: item.route ?? '',
      isCritical: item.isCritical,
      showOnEmergencyProfile: item.showOnEmergencyProfile,
      purpose: item.purpose ?? '',
      notes: item.notes ?? '',
    })
    setEditingItem(item)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await cfFetch(`deleteMedication/${id}`, { method: 'DELETE' })
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
      const res = editingItem
        ? await cfFetch(`updateMedication/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(values),
          })
        : await cfFetch('createMedication', {
            method: 'POST',
            body: JSON.stringify(values),
          })
      if (!res.ok) throw new Error()
      setDrawerOpen(false)
      await fetchItems()
    } catch {
      setSubmitError('Failed to save. Please try again.')
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
            <p className="text-3xl mb-3">💊</p>
            <p className="text-sm font-medium text-[#1C2B1E] mb-1">{t('emergency.noMedications', lang)}</p>
            <p className="text-xs text-gray-400 mb-4">Add medications that responders should know about</p>
            <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
              {t('emergency.addMedication', lang)}
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
                subtitle={[item.dose, item.frequency, item.route].filter(Boolean).join(' · ')}
                isCritical={item.isCritical}
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
        title={editingItem ? `${t('common.edit', lang)} ${t('emergency.medications', lang)}` : t('emergency.addMedication', lang)}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className={LABEL_CLS}>{t('medication.name', lang)} <span className="text-red-400">*</span></label>
            <input
              {...register('name')}
              type="text"
              placeholder={t('medication.namePlaceholder', lang)}
              className={`${INPUT_CLS} ${errors.name ? INPUT_ERR_CLS : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>{t('medication.genericName', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <input {...register('genericName')} type="text" placeholder="e.g. metformin hydrochloride" className={INPUT_CLS} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>{t('medication.dose', lang)}</label>
              <input {...register('dose')} type="text" placeholder={t('medication.dosePlaceholder', lang)} className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>{t('medication.frequency', lang)}</label>
              <input {...register('frequency')} type="text" placeholder={t('medication.frequencyPlaceholder', lang)} className={INPUT_CLS} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>{t('medication.route', lang)}</label>
            <select {...register('route')} className={SELECT_CLS}>
              <option value="">{t('medication.selectRoute', lang)}</option>
              <option value="oral">{t('medication.route.oral', lang)}</option>
              <option value="topical">{t('medication.route.topical', lang)}</option>
              <option value="inhaled">{t('medication.route.inhaled', lang)}</option>
              <option value="injected">{t('medication.route.injected', lang)}</option>
              <option value="sublingual">{t('medication.route.sublingual', lang)}</option>
              <option value="other">{t('medication.route.other', lang)}</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex-shrink-0">
              <input type="checkbox" {...register('isCritical')} className="sr-only peer" />
              <div className={TOGGLE_TRACK_CLS} />
            </div>
            <span className="text-sm text-[#1C2B1E] group-hover:text-[#4A7A50] transition-colors">
              {t('emergency.critical', lang)} — must not be missed
            </span>
          </label>

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
            <label className={LABEL_CLS}>{t('medication.purpose', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <textarea {...register('purpose')} rows={2} placeholder={t('medication.purposePlaceholder', lang)} className={TEXTAREA_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>{t('emergency.notes', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <textarea {...register('notes')} rows={2} placeholder={t('form.additionalDetails', lang)} className={TEXTAREA_CLS} />
          </div>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button type="submit" disabled={submitting} className={SAVE_BTN_CLS} style={SAVE_BTN_STYLE}>
            {submitting ? 'Saving…' : editingItem ? t('profile.saveChanges', lang) : t('emergency.addMedication', lang)}
          </button>
        </form>
      </SlideDrawer>
    </>
  )
}
