'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { cfFetch } from '@/lib/api'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

// ─── Types ───────────────────────────────────────────

interface CatalogEntry {
  id: string
  category: string
  categoryEmoji: string
  isCritical: boolean
  icdCode: string
  names: Record<string, string>
  emergencyNote: string
}

interface SavedCondition {
  id: string
  catalogRef: string | null | undefined
  name: string
  notes: string
  isCritical: boolean
  isActive: boolean
  showOnEmergencyProfile: boolean
}

interface CustomForm {
  name: string
  icdCode: string
  notes: string
  isCritical: boolean
  showOnEmergencyProfile: boolean
}

// ─── Constants ───────────────────────────────────────

const CATALOG_URL = `${CF_FUNCTIONS_BASE}/getCatalog`

const CATEGORY_ORDER = [
  'cardiovascular',
  'neurological',
  'metabolic_endocrine',
  'respiratory',
  'hematological',
  'cognitive_neurodevelopmental',
  'movement_neuromuscular',
  'renal',
  'hepatic_gi',
  'immune_autoimmune',
  'endocrine_crises',
  'oncological',
  'genetic_rare',
  'mental_health',
  'medical_devices',
  'critical_contraindications',
]

const DEFAULT_CUSTOM_FORM: CustomForm = {
  name: '',
  icdCode: '',
  notes: '',
  isCritical: false,
  showOnEmergencyProfile: true,
}

// ─── Component ───────────────────────────────────────

export function ConditionsTab() {
  const { lang } = useLang()
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [saved, setSaved] = useState<SavedCondition[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [savingCustom, setSavingCustom] = useState(false)
  const [customForm, setCustomForm] = useState<CustomForm>(DEFAULT_CUSTOM_FORM)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [catalogRes, savedRes] = await Promise.all([
        fetch(`${CATALOG_URL}?type=condition`),
        cfFetch('getConditions'),
      ])
      const catalogData = await catalogRes.json() as { entries?: CatalogEntry[] }
      const savedData = await savedRes.json() as { conditions?: SavedCondition[] }
      setCatalog(catalogData.entries ?? [])
      setSaved(savedData.conditions ?? [])
    } catch (err) {
      console.error('ConditionsTab load error:', err)
    } finally {
      setLoading(false)
    }
  }

  function isSaved(catalogId: string): SavedCondition | undefined {
    return saved.find(s => s.catalogRef === catalogId)
  }

  async function handleCheck(entry: CatalogEntry, checked: boolean) {
    const existing = isSaved(entry.id)
    setSaving(prev => new Set(prev).add(entry.id))

    try {
      if (checked && !existing) {
        const res = await cfFetch('createCondition', {
          method: 'POST',
          body: JSON.stringify({
            name: entry.names['en'],
            catalogRef: entry.id,
            icdCode: entry.icdCode ?? '',
            isCritical: entry.isCritical,
            isActive: true,
            showOnEmergencyProfile: true,
            notes: '',
          }),
        })
        const data = await res.json() as { id?: string; conditionId?: string; docId?: string }
        const newId = data.id ?? data.conditionId ?? data.docId ?? ''
        setSaved(prev => [...prev, {
          id: newId,
          catalogRef: entry.id,
          name: entry.names['en'],
          notes: '',
          isCritical: entry.isCritical,
          isActive: true,
          showOnEmergencyProfile: true,
        }])
      } else if (!checked && existing) {
        await cfFetch(`deleteCondition/${existing.id}`, { method: 'DELETE' })
        setSaved(prev => prev.filter(s => s.id !== existing.id))
      }
    } catch (err) {
      console.error('Condition toggle error:', err)
    } finally {
      setSaving(prev => {
        const next = new Set(prev)
        next.delete(entry.id)
        return next
      })
    }
  }

  async function handleNotes(savedId: string, notes: string) {
    try {
      await cfFetch(`updateCondition/${savedId}`, {
        method: 'PUT',
        body: JSON.stringify({ notes }),
      })
      setSaved(prev => prev.map(s => s.id === savedId ? { ...s, notes } : s))
    } catch (err) {
      console.error('Notes save error:', err)
    }
  }

  async function handleToggleProfile(savedId: string, showOnEmergencyProfile: boolean) {
    try {
      await cfFetch(`updateCondition/${savedId}`, {
        method: 'PUT',
        body: JSON.stringify({ showOnEmergencyProfile }),
      })
      setSaved(prev => prev.map(s =>
        s.id === savedId ? { ...s, showOnEmergencyProfile } : s
      ))
    } catch (err) {
      console.error('Toggle profile error:', err)
    }
  }

  async function handleSaveCustom() {
    if (!customForm.name) return
    setSavingCustom(true)
    try {
      const res = await cfFetch('createCondition', {
        method: 'POST',
        body: JSON.stringify({
          name: customForm.name,
          icdCode: customForm.icdCode || undefined,
          isCritical: customForm.isCritical,
          isActive: true,
          showOnEmergencyProfile: customForm.showOnEmergencyProfile,
          notes: customForm.notes,
        }),
      })
      const data = await res.json() as { id?: string; conditionId?: string; docId?: string }
      const newId = data.id ?? data.conditionId ?? data.docId ?? ''
      setSaved(prev => [...prev, {
        id: newId,
        catalogRef: null,
        name: customForm.name,
        notes: customForm.notes,
        isCritical: customForm.isCritical,
        isActive: true,
        showOnEmergencyProfile: customForm.showOnEmergencyProfile,
      }])
      setCustomForm(DEFAULT_CUSTOM_FORM)
      setShowCustomForm(false)
      setSearch('')
    } catch (err) {
      console.error('Save custom condition error:', err)
    } finally {
      setSavingCustom(false)
    }
  }

  async function handleDeleteCustom(id: string) {
    try {
      await cfFetch(`deleteCondition/${id}`, { method: 'DELETE' })
      setSaved(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Delete custom condition error:', err)
    }
  }

  function matchesSearch(entry: CatalogEntry): boolean {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const name = (entry.names[lang] ?? entry.names['en']).toLowerCase()
    return name.includes(q)
  }

  const grouped = catalog.reduce((acc, entry) => {
    const cat = entry.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(entry)
    return acc
  }, {} as Record<string, CatalogEntry[]>)

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 animate-pulse h-14"
            style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
          />
        ))}
      </div>
    )
  }

  const customConditions = saved.filter(s => !s.catalogRef)
  const selectedCount = saved.length

  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  const CATEGORY_DISPLAY: Record<string, { label: string; emoji: string }> = {
    cardiovascular: { label: t('cat.cardiovascular', lang as Lang), emoji: '🫀' },
    neurological: { label: t('cat.neurological', lang as Lang), emoji: '🧠' },
    metabolic_endocrine: { label: t('cat.metabolic', lang as Lang), emoji: '🩸' },
    respiratory: { label: t('cat.respiratory', lang as Lang), emoji: '🫁' },
    hematological: { label: t('cat.hematological', lang as Lang), emoji: '🧬' },
    cognitive_neurodevelopmental: { label: t('cat.cognitive', lang as Lang), emoji: '🧩' },
    movement_neuromuscular: { label: t('cat.movement', lang as Lang), emoji: '🏃' },
    renal: { label: t('cat.renal', lang as Lang), emoji: '🫘' },
    hepatic_gi: { label: t('cat.hepatic', lang as Lang), emoji: '🍀' },
    immune_autoimmune: { label: t('cat.immune', lang as Lang), emoji: '🦠' },
    endocrine_crises: { label: t('cat.endocrine', lang as Lang), emoji: '⚡' },
    oncological: { label: t('cat.oncological', lang as Lang), emoji: '🧪' },
    genetic_rare: { label: t('cat.genetic', lang as Lang), emoji: '🔬' },
    mental_health: { label: t('cat.mental_health', lang as Lang), emoji: '💙' },
    medical_devices: { label: t('cat.devices', lang as Lang), emoji: '🏥' },
    critical_contraindications: { label: t('cat.critical', lang as Lang), emoji: '⚠️' },
  }

  // When searching, auto-expand categories with matches
  const searchActive = search.trim().length > 0
  const categoriesToExpand = searchActive
    ? new Set(sortedCategories.filter(cat => (grouped[cat] ?? []).some(matchesSearch)))
    : null
  const isExpanded = (cat: string) =>
    categoriesToExpand ? categoriesToExpand.has(cat) : expandedCategories.has(cat)

  const hasAnyCatalogMatch = searchActive
    ? sortedCategories.some(cat => (grouped[cat] ?? []).some(matchesSearch))
    : true

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('conditions.search', lang as Lang)}
          className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm bg-white focus:outline-none focus:border-[#4A7A50] focus:ring-1 focus:ring-[#4A7A50]/20"
        />
        <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {selectedCount > 0 && !searchActive && (
        <div className="bg-[#E8F2E6] rounded-2xl px-4 py-2.5 flex items-center gap-2 mb-3">
          <span className="text-[#4A7A50] text-sm font-medium">
            {selectedCount} condition{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* Custom conditions form */}
      {showCustomForm && (
        <div className="bg-white rounded-2xl p-4 mb-4 border-2 border-dashed border-[#C8DEC4]">
          <h4 className="text-sm font-semibold text-[#1C2B1E] mb-3">
            {t('conditions.customCondition', lang as Lang)}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              value={customForm.name}
              onChange={e => setCustomForm(p => ({ ...p, name: e.target.value }))}
              placeholder={t('conditions.conditionName', lang as Lang)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
            />
            <input
              type="text"
              value={customForm.icdCode}
              onChange={e => setCustomForm(p => ({ ...p, icdCode: e.target.value }))}
              placeholder="ICD code (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
            />
            <input
              type="text"
              value={customForm.notes}
              onChange={e => setCustomForm(p => ({ ...p, notes: e.target.value }))}
              placeholder={t('form.additionalDetails', lang as Lang)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4A7A50]"
            />
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={customForm.isCritical}
                  onChange={e => setCustomForm(p => ({ ...p, isCritical: e.target.checked }))}
                  className="accent-[#4A7A50] w-4 h-4"
                />
                <span className="text-gray-700">⚠️ Critical</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={customForm.showOnEmergencyProfile}
                  onChange={e => setCustomForm(p => ({ ...p, showOnEmergencyProfile: e.target.checked }))}
                  className="accent-[#4A7A50] w-4 h-4"
                />
                <span className="text-gray-700">{t('common.showOnEmergency', lang as Lang)}</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleSaveCustom()}
                disabled={!customForm.name || savingCustom}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(145deg,#44664a,#7a9e7e)' }}
              >
                {savingCustom ? '...' : t('common.save', lang as Lang)}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200"
              >
                {t('common.cancel', lang as Lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No catalog match — prompt to add custom */}
      {searchActive && !hasAnyCatalogMatch && !showCustomForm && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <p className="text-sm text-amber-800 mb-3">
            🔍 &ldquo;{search}&rdquo; — {t('conditions.notFound', lang as Lang)}
          </p>
          <button
            type="button"
            onClick={() => {
              setCustomForm(p => ({ ...p, name: search }))
              setShowCustomForm(true)
            }}
            className="text-sm font-medium text-[#4A7A50] underline"
          >
            + {t('conditions.addCustom', lang as Lang)}
          </button>
        </div>
      )}

      {/* Custom conditions section */}
      {customConditions.length > 0 && (
        <div
          className="bg-white rounded-2xl overflow-hidden border-2 border-dashed border-[#C8DEC4]"
          style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[#F0F4EE]">
            <span className="text-lg">📝</span>
            <span className="font-semibold text-sm text-[#1C2B1E]">
              {t('conditions.customCategory', lang as Lang)}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#4A7A50] text-white text-xs font-medium">
              {customConditions.length}
            </span>
          </div>
          {customConditions.map(cond => (
            <div
              key={cond.id}
              className="flex items-start gap-3 px-4 py-3 border-b border-[#F8FAF8] last:border-0 bg-[#F4FAF4]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#1C2B1E]">{cond.name}</span>
                  {cond.isCritical && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                      ⚠️
                    </span>
                  )}
                </div>
                {cond.notes && (
                  <p className="text-xs text-gray-500 mt-0.5">{cond.notes}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => void handleToggleProfile(cond.id, true)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      cond.showOnEmergencyProfile
                        ? 'bg-[#4A7A50] text-white border-[#4A7A50]'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    🏥 {t('common.showOnEmergency', lang as Lang)}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggleProfile(cond.id, false)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      !cond.showOnEmergencyProfile
                        ? 'bg-gray-600 text-white border-gray-600'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    👁 {t('common.privateOnly', lang as Lang)}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleDeleteCustom(cond.id)}
                className="text-xs text-red-400 hover:text-red-600 flex-shrink-0 mt-0.5"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Catalog categories */}
      {sortedCategories.map(cat => {
        const entries = grouped[cat] ?? []
        const filteredEntries = searchActive ? entries.filter(matchesSearch) : entries
        if (searchActive && filteredEntries.length === 0) return null

        const display = CATEGORY_DISPLAY[cat] ?? { label: cat, emoji: '📋' }
        const expanded = isExpanded(cat)
        const selectedInCat = entries.filter(e => isSaved(e.id)).length

        return (
          <div
            key={cat}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
          >
            <button
              type="button"
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#FAFAF8] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{display.emoji}</span>
                <span className="font-semibold text-sm text-[#1C2B1E]">
                  {display.label}
                </span>
                {selectedInCat > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#4A7A50] text-white text-xs font-medium">
                    {selectedInCat}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {searchActive ? filteredEntries.length : entries.length} conditions
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>

            {expanded && (
              <div className="border-t border-[#F0F4EE]">
                {filteredEntries.map(entry => {
                  const savedEntry = isSaved(entry.id)
                  const isChecked = !!savedEntry
                  const isSavingThis = saving.has(entry.id)
                  const name = entry.names[lang] ?? entry.names['en']

                  return (
                    <div
                      key={entry.id}
                      className={`border-b border-[#F8FAF8] last:border-0 transition-colors ${isChecked ? 'bg-[#F4FAF4]' : ''}`}
                    >
                      <div className="flex items-start gap-3 px-4 py-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {isSavingThis ? (
                            <div className="w-5 h-5 rounded border-2 border-[#4A7A50] flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full border-2 border-[#4A7A50] border-t-transparent animate-spin" />
                            </div>
                          ) : (
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => void handleCheck(entry, e.target.checked)}
                              className="w-5 h-5 rounded accent-[#4A7A50] cursor-pointer"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm ${isChecked ? 'font-semibold text-[#1C2B1E]' : 'text-gray-700'}`}>
                              {name}
                            </span>
                            {entry.isCritical && (
                              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                                ⚠️ Critical
                              </span>
                            )}
                          </div>

                          {entry.icdCode && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ICD: {entry.icdCode}
                            </p>
                          )}

                          {entry.isCritical && entry.emergencyNote && (
                            <p className="text-xs text-red-500 mt-0.5">
                              {entry.emergencyNote}
                            </p>
                          )}

                          {isChecked && savedEntry && (
                            <div className="mt-2 space-y-2">
                              {/* Profile visibility pills */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => void handleToggleProfile(savedEntry.id, true)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                    savedEntry.showOnEmergencyProfile
                                      ? 'bg-[#4A7A50] text-white border-[#4A7A50]'
                                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#4A7A50]'
                                  }`}
                                >
                                  🏥 {t('common.showOnEmergency', lang as Lang)}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleToggleProfile(savedEntry.id, false)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                    !savedEntry.showOnEmergencyProfile
                                      ? 'bg-gray-600 text-white border-gray-600'
                                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                  }`}
                                >
                                  👁 {t('common.privateOnly', lang as Lang)}
                                </button>
                              </div>
                              {/* Notes */}
                              <NoteInput
                                value={savedEntry.notes}
                                savedId={savedEntry.id}
                                onSave={handleNotes}
                                lang={lang}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Debounced notes input ────────────────────────────

function NoteInput({
  value,
  savedId,
  onSave,
  lang,
}: {
  value: string
  savedId: string
  onSave: (id: string, notes: string) => void
  lang: string
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onSave(savedId, localValue)
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [localValue, onSave, savedId, value])

  return (
    <input
      type="text"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      placeholder={t('form.additionalDetails', lang as Lang)}
      className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#4A7A50] focus:ring-1 focus:ring-[#4A7A50]/20"
      onClick={e => e.stopPropagation()}
    />
  )
}
