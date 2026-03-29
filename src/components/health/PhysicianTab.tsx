'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cfFetch } from '@/lib/api'
import { SlideDrawer } from './SlideDrawer'
import {
  INPUT_CLS, INPUT_ERR_CLS, TEXTAREA_CLS, SELECT_CLS,
  LABEL_CLS, TOGGLE_TRACK_CLS, SAVE_BTN_CLS, SAVE_BTN_STYLE, EMPTY_STATE_CLS,
} from './formStyles'

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

interface PrimaryPhysician {
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

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(7, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  language: z.string().optional(),
  notes: z.string().optional(),
  showOnEmergencyProfile: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const DEFAULTS: FormValues = {
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

export function PhysicianTab() {
  const [physician, setPhysician] = useState<PrimaryPhysician | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })

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
    void fetchPhysician()
  }, [fetchPhysician])

  function openAdd() {
    reset(DEFAULTS)
    setSubmitError(null)
    setDrawerOpen(true)
  }

  function openEdit() {
    if (!physician) return
    reset({
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
    setSubmitError(null)
    setDrawerOpen(true)
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await cfFetch('upsertPrimaryPhysician', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      setDrawerOpen(false)
      await fetchPhysician()
    } catch {
      setSubmitError('Failed to save. Please try again.')
    } finally {
      setSubmitting(false)
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
    <>
      {!physician ? (
        <div className={EMPTY_STATE_CLS}>
          <p className="text-3xl mb-3">👨‍⚕️</p>
          <p className="text-sm font-medium text-[#1C2B1E] mb-1">No primary physician set</p>
          <p className="text-xs text-gray-400 mb-4">Add your primary care physician or specialist</p>
          <button type="button" onClick={openAdd} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={SAVE_BTN_STYLE}>
            Add Primary Physician
          </button>
        </div>
      ) : (
        <div
          className="p-5 rounded-2xl border border-gray-100 bg-white"
          style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-semibold text-sm text-[#1C2B1E]">{physician.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {physician.specialty} · {physician.city}, {physician.country}
              </p>
              <a
                href={`tel:${physician.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={SAVE_BTN_STYLE}
              >
                📞 {physician.phone}
              </a>
              {physician.notes && (
                <p className="text-xs text-gray-400 mt-2">{physician.notes}</p>
              )}
            </div>
            <button
              type="button"
              onClick={openEdit}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-[#4A7A50] hover:bg-[#4A7A50]/8 transition-colors flex-shrink-0"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      <SlideDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={physician ? 'Edit Primary Physician' : 'Add Primary Physician'}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className={LABEL_CLS}>Full name <span className="text-red-400">*</span></label>
            <input
              {...register('name')}
              type="text"
              placeholder="Dr. Ana Martínez"
              className={`${INPUT_CLS} ${errors.name ? INPUT_ERR_CLS : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Specialty <span className="text-red-400">*</span></label>
            <input
              {...register('specialty')}
              type="text"
              placeholder="e.g. Cardiologist, General Practitioner"
              className={`${INPUT_CLS} ${errors.specialty ? INPUT_ERR_CLS : ''}`}
            />
            {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Country <span className="text-red-400">*</span></label>
              <input
                {...register('country')}
                type="text"
                placeholder="Costa Rica"
                className={`${INPUT_CLS} ${errors.country ? INPUT_ERR_CLS : ''}`}
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>City <span className="text-red-400">*</span></label>
              <input
                {...register('city')}
                type="text"
                placeholder="San José"
                className={`${INPUT_CLS} ${errors.city ? INPUT_ERR_CLS : ''}`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Phone <span className="text-red-400">*</span></label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+506 2222 3333"
              className={`${INPUT_CLS} ${errors.phone ? INPUT_ERR_CLS : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Email <span className="text-gray-300 font-normal">(optional — not shown publicly)</span></label>
            <input
              {...register('email')}
              type="email"
              placeholder="dr.martinez@clinic.com"
              className={`${INPUT_CLS} ${errors.email ? INPUT_ERR_CLS : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className={LABEL_CLS}>Language</label>
            <select {...register('language')} className={SELECT_CLS}>
              <option value="">Select language...</option>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL_CLS}>Notes <span className="text-gray-300 font-normal">(optional)</span></label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="e.g. Clínica Santa Fe · Mon–Fri 8am–5pm"
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

          {submitError && <p className="text-xs text-red-500">{submitError}</p>}

          <button type="submit" disabled={submitting} className={SAVE_BTN_CLS} style={SAVE_BTN_STYLE}>
            {submitting ? 'Saving…' : physician ? 'Save changes' : 'Add physician'}
          </button>
        </form>
      </SlideDrawer>
    </>
  )
}
