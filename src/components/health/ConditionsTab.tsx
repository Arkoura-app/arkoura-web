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

// ─── Types ───────────────────────────────────────────

export interface Condition {
  id: string
  name: string
  icdCode?: string
  isCritical: boolean
  showOnEmergencyProfile: boolean
  active: boolean
  notes?: string
}

// ─── Schema ──────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Condition name is required'),
  icdCode: z.string().optional(),
  isCritical: z.boolean(),
  showOnEmergencyProfile: z.boolean(),
  active: z.boolean(),
  notes: z.string().max(2000, 'Max 2000 characters').optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  name: '',
  icdCode: '',
  isCritical: false,
  showOnEmergencyProfile: true,
  active: true,
  notes: '',
}

// ─── Component ───────────────────────────────────────

interface ConditionsTabProps {
  initialData?: Condition[]
}

export function ConditionsTab({ initialData }: ConditionsTabProps) {
  const { lang } = useLang()
  const [items, setItems] = useState<Condition[]>(initialData ?? [])
  const [loading, setLoading] = useState(!initialData)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Condition | null>(null)
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
      const res = await cfFetch('getConditions')
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { conditions: Condition[] }
      setItems(json.conditions ?? [])
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

  function openEdit(item: Condition) {
    reset({
      name: item.name,
      icdCode: item.icdCode ?? '',
      isCritical: item.isCritical,
      showOnEmergencyProfile: item.showOnEmergencyProfile,
      active: item.active,
      notes: item.notes ?? '',
    })
    setEditingItem(item)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await cfFetch(`deleteCondition/${id}`, { method: 'DELETE' })
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
        ? await cfFetch(`updateCondition/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(values),
          })
        : await cfFetch('createCondition', {
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
            <p className="text-3xl mb-3">🏥</p>
            <p className="text-sm font-medium text-[#1C2B1E] mb-1">{t('emergency.noConditions', lang)}</p>
            <p className="text-xs text-gray-400 mb-4">Add any medical conditions a responder should know about</p>
            <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
              {t('emergency.addCondition', lang)}
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
                subtitle={[item.icdCode, item.notes].filter(Boolean).join(' · ')}
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
        title={editingItem ? `${t('common.edit', lang)} ${t('emergency.conditions', lang)}` : t('emergency.addCondition', lang)}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className={LABEL_CLS}>{t('condition.name', lang)} <span className="text-red-400">*</span></label>
            <input
              {...register('name')}
              type="text"
              placeholder={t('condition.namePlaceholder', lang)}
              className={`${INPUT_CLS} ${errors.name ? INPUT_ERR_CLS : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>{t('condition.icdCode', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <input
              {...register('icdCode')}
              type="text"
              placeholder={t('condition.icdPlaceholder', lang)}
              className={INPUT_CLS}
            />
          </div>

          <ToggleField label={t('emergency.critical', lang)} name="isCritical" register={register} />
          <ToggleField label={t('common.showOnEmergency', lang)} name="showOnEmergencyProfile" register={register} />
          <ToggleField label={t('form.active', lang)} name="active" register={register} />

          <div>
            <label className={LABEL_CLS}>{t('emergency.notes', lang)} <span className="text-gray-300 font-normal">{t('form.optional', lang)}</span></label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder={t('form.additionalDetails', lang)}
              className={TEXTAREA_CLS}
            />
            {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>}
          </div>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button type="submit" disabled={submitting} className={SAVE_BTN_CLS} style={SAVE_BTN_STYLE}>
            {submitting ? 'Saving…' : editingItem ? t('profile.saveChanges', lang) : t('emergency.addCondition', lang)}
          </button>
        </form>
      </SlideDrawer>
    </>
  )
}

// ─── Shared toggle within this file ──────────────────

function ToggleField({
  label,
  name,
  register,
}: {
  label: string
  name: 'isCritical' | 'showOnEmergencyProfile' | 'active'
  register: ReturnType<typeof useForm<FormValues>>['register']
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group w-fit">
      <div className="relative flex-shrink-0">
        <input type="checkbox" {...register(name)} className="sr-only peer" />
        <div className={TOGGLE_TRACK_CLS} />
      </div>
      <span className="text-sm text-[#1C2B1E] group-hover:text-[#4A7A50] transition-colors">
        {label}
      </span>
    </label>
  )
}
