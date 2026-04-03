'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
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
  catalogRef: string
  name: string
  notes: string
  isCritical: boolean
  isActive: boolean
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

// ─── Component ───────────────────────────────────────

export function ConditionsTab() {
  const { lang } = useLang()
  const [catalog, setCatalog] = useState<CatalogEntry[]>([])
  const [saved, setSaved] = useState<SavedCondition[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState<Set<string>>(new Set())

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [catalogRes, savedRes] = await Promise.all([
        fetch(`${CATALOG_URL}?type=condition`),
        cfFetch('getConditions'),
      ])
      const catalogData = await catalogRes.json()
      const savedData = await savedRes.json()
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
        const data = await res.json()
        setSaved(prev => [...prev, {
          id: data.id,
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
    cardiovascular: { label: t('cat.cardiovascular', lang), emoji: '🫀' },
    neurological: { label: t('cat.neurological', lang), emoji: '🧠' },
    metabolic_endocrine: { label: t('cat.metabolic', lang), emoji: '🩸' },
    respiratory: { label: t('cat.respiratory', lang), emoji: '🫁' },
    hematological: { label: t('cat.hematological', lang), emoji: '🧬' },
    cognitive_neurodevelopmental: { label: t('cat.cognitive', lang), emoji: '🧩' },
    movement_neuromuscular: { label: t('cat.movement', lang), emoji: '🏃' },
    renal: { label: t('cat.renal', lang), emoji: '🫘' },
    hepatic_gi: { label: t('cat.hepatic', lang), emoji: '🍀' },
    immune_autoimmune: { label: t('cat.immune', lang), emoji: '🦠' },
    endocrine_crises: { label: t('cat.endocrine', lang), emoji: '⚡' },
    oncological: { label: t('cat.oncological', lang), emoji: '🧪' },
    genetic_rare: { label: t('cat.genetic', lang), emoji: '🔬' },
    mental_health: { label: t('cat.mental_health', lang), emoji: '💙' },
    medical_devices: { label: t('cat.devices', lang), emoji: '🏥' },
    critical_contraindications: { label: t('cat.critical', lang), emoji: '⚠️' },
  }

  return (
    <div className="space-y-2">
      {selectedCount > 0 && (
        <div className="bg-[#E8F2E6] rounded-2xl px-4 py-2.5 flex items-center gap-2 mb-3">
          <span className="text-[#4A7A50] text-sm font-medium">
            {selectedCount} condition{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {sortedCategories.map(cat => {
        const entries = grouped[cat]
        const display = CATEGORY_DISPLAY[cat] ?? { label: cat, emoji: '📋' }
        const isExpanded = expandedCategories.has(cat)
        const selectedInCat = entries.filter(e => isSaved(e.id)).length

        return (
          <div
            key={cat}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
          >
            <button
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
                  {entries.length} conditions
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

            {isExpanded && (
              <div className="border-t border-[#F0F4EE]">
                {entries.map(entry => {
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
                              onChange={e => handleCheck(entry, e.target.checked)}
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
                            <div className="mt-2">
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
  }, [localValue])

  return (
    <input
      type="text"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      placeholder={t('form.additionalDetails', lang as Parameters<typeof t>[1])}
      className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#4A7A50] focus:ring-1 focus:ring-[#4A7A50]/20"
      onClick={e => e.stopPropagation()}
    />
  )
}
