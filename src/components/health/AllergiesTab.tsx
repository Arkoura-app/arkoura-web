'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cfFetch } from '@/lib/api'
import { RecordCard } from './RecordCard'
import { SlideDrawer } from './SlideDrawer'
import {
  INPUT_CLS, INPUT_ERR_CLS, TEXTAREA_CLS, SELECT_CLS,
  LABEL_CLS, TOGGLE_TRACK_CLS, SAVE_BTN_CLS, SAVE_BTN_STYLE, EMPTY_STATE_CLS,
} from './formStyles'

// ─── Types ───────────────────────────────────────────

interface Allergy {
  id: string
  allergen: string
  allergenType: string
  severity: string
  reaction?: string
  showOnEmergencyProfile: boolean
  notes?: string
  isCritical?: boolean
}

// ─── Schema ──────────────────────────────────────────

const schema = z.object({
  allergen: z.string().min(1, 'Allergen name is required'),
  allergenType: z.string().min(1, 'Type is required'),
  severity: z.string().min(1, 'Severity is required'),
  reaction: z.string().optional(),
  showOnEmergencyProfile: z.boolean(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
  allergen: '',
  allergenType: '',
  severity: '',
  reaction: '',
  showOnEmergencyProfile: true,
  notes: '',
}

// ─── Severity helpers ─────────────────────────────────

function severityBadge(severity: string) {
  const map: Record<string, string> = {
    mild: 'bg-gray-100 text-gray-600',
    moderate: 'bg-amber-100 text-amber-700',
    severe: 'bg-orange-100 text-orange-700',
    life_threatening: 'bg-red-100 text-red-700',
  }
  const cls = map[severity] ?? 'bg-gray-100 text-gray-600'
  const label = severity.replace('_', ' ')
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${cls}`}>
      {label}
    </span>
  )
}

// ─── Component ───────────────────────────────────────

export function AllergiesTab() {
  const [items, setItems] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Allergy | null>(null)
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
      const res = await cfFetch('getAllergies')
      if (!res.ok) throw new Error()
      const json = (await res.json()) as { allergies: Allergy[] }
      setItems(json.allergies ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchItems()
  }, [fetchItems])

  function openAdd() {
    reset(DEFAULTS)
    setEditingItem(null)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  function openEdit(item: Allergy) {
    reset({
      allergen: item.allergen,
      allergenType: item.allergenType,
      severity: item.severity,
      reaction: item.reaction ?? '',
      showOnEmergencyProfile: item.showOnEmergencyProfile,
      notes: item.notes ?? '',
    })
    setEditingItem(item)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await cfFetch(`deleteAllergy/${id}`, { method: 'DELETE' })
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
        ? await cfFetch(`updateAllergy/${editingItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(values),
          })
        : await cfFetch('createAllergy', {
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
            <p className="text-3xl mb-3">🚨</p>
            <p className="text-sm font-medium text-[#1C2B1E] mb-1">No allergies recorded</p>
            <p className="text-xs text-gray-400 mb-4">List any allergies, especially critical ones</p>
            <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
              Add Allergy
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
                + Add
              </button>
            </div>
            {items.map((item) => (
              <RecordCard
                key={item.id}
                title={item.allergen}
                subtitle={[item.reaction].filter(Boolean).join('')}
                isCritical={item.isCritical || item.severity === 'life_threatening'}
                badge={
                  <span className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {item.allergenType}
                    </span>
                    {severityBadge(item.severity)}
                  </span>
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
        title={editingItem ? 'Edit Allergy' : 'Add Allergy'}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className={LABEL_CLS}>Allergen <span className="text-red-400">*</span></label>
            <input
              {...register('allergen')}
              type="text"
              placeholder="e.g. Penicillin"
              className={`${INPUT_CLS} ${errors.allergen ? INPUT_ERR_CLS : ''}`}
            />
            {errors.allergen && <p className="text-xs text-red-500 mt-1">{errors.allergen.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Type <span className="text-red-400">*</span></label>
            <select
              {...register('allergenType')}
              className={`${SELECT_CLS} ${errors.allergenType ? INPUT_ERR_CLS : ''}`}
            >
              <option value="">Select type...</option>
              <option value="drug">Drug</option>
              <option value="food">Food</option>
              <option value="environmental">Environmental</option>
              <option value="contact">Contact</option>
              <option value="other">Other</option>
            </select>
            {errors.allergenType && <p className="text-xs text-red-500 mt-1">{errors.allergenType.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Severity <span className="text-red-400">*</span></label>
            <select
              {...register('severity')}
              className={`${SELECT_CLS} ${errors.severity ? INPUT_ERR_CLS : ''}`}
            >
              <option value="">Select severity...</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="life_threatening">Life-threatening</option>
            </select>
            {errors.severity && <p className="text-xs text-red-500 mt-1">{errors.severity.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Reaction <span className="text-gray-300 font-normal">(optional)</span></label>
            <textarea
              {...register('reaction')}
              rows={2}
              placeholder="e.g. Anaphylaxis, hives..."
              className={TEXTAREA_CLS}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex-shrink-0">
              <input type="checkbox" {...register('showOnEmergencyProfile')} className="sr-only peer" />
              <div className={TOGGLE_TRACK_CLS} />
            </div>
            <span className="text-sm text-[#1C2B1E] group-hover:text-[#4A7A50] transition-colors">
              Show on emergency profile
            </span>
          </label>

          <div>
            <label className={LABEL_CLS}>Notes <span className="text-gray-300 font-normal">(optional)</span></label>
            <textarea {...register('notes')} rows={2} placeholder="Additional details..." className={TEXTAREA_CLS} />
          </div>

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button type="submit" disabled={submitting} className={SAVE_BTN_CLS} style={SAVE_BTN_STYLE}>
            {submitting ? 'Saving…' : editingItem ? 'Save changes' : 'Add allergy'}
          </button>
        </form>
      </SlideDrawer>
    </>
  )
}
