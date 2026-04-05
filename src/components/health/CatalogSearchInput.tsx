'use client'

import { useState, useRef, useEffect } from 'react'
import { useCatalogSearch } from '@/hooks/useCatalogSearch'
import { t, type Lang } from '@/lib/i18n'

interface SelectionResult {
  id: string | null
  name: string
  allergenType?: string
  drugClass?: string
  isCritical?: boolean
  route?: string
  genericName?: string
}

interface Props {
  type: 'allergen' | 'medication'
  lang: Lang
  placeholder: string
  value: string
  onSelect: (entry: SelectionResult) => void
  disabled?: boolean
}

export function CatalogSearchInput({ type, lang, placeholder, value, onSelect, disabled }: Props) {
  const [inputValue, setInputValue] = useState(value)
  const [open, setOpen] = useState(false)
  const { results, searching, search } = useCatalogSearch(type)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleInput(v: string) {
    setInputValue(v)
    void search(v)
    setOpen(true)
  }

  function handleSelect(entry: {
    id: string
    names: Record<string, string>
    allergenType?: string
    drugClass?: string
    isCritical?: boolean
    route?: string
    genericNames?: string
  }) {
    const name = entry.names[lang] ?? entry.names['en']
    setInputValue(name)
    setOpen(false)
    onSelect({
      id: entry.id,
      name: entry.names['en'],
      allergenType: entry.allergenType,
      drugClass: entry.drugClass,
      isCritical: entry.isCritical ?? false,
      route: entry.route,
      genericName: entry.genericNames?.split(',')[0]?.trim(),
    })
  }

  function handleCustom() {
    setOpen(false)
    onSelect({ id: null, name: inputValue })
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => { if (inputValue.length >= 2) setOpen(true) }}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#4A7A50] focus:ring-1 focus:ring-[#4A7A50]/20 ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
      />

      {open && inputValue.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
          {searching && (
            <div className="px-3 py-2 text-sm text-gray-400">Searching...</div>
          )}

          {results.map(entry => (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleSelect(entry)}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#F4FAF4] border-b border-gray-50 last:border-0 flex items-center justify-between"
            >
              <span className="text-[#1C2B1E]">
                {entry.names[lang] ?? entry.names['en']}
              </span>
              {entry.isCritical && (
                <span className="text-xs text-red-500">⚠️</span>
              )}
            </button>
          ))}

          {!searching && inputValue.trim().length > 0 && (
            <button
              type="button"
              onClick={handleCustom}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 text-[#4A7A50] font-medium border-t border-gray-50"
            >
              + &ldquo;{inputValue}&rdquo; — {t('catalog.addCustomEntry', lang)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
