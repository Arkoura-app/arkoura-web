'use client'

import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { SUPPORTED_LANGS, LANG_NAMES } from '@/lib/i18n'

export function LanguagePicker() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
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

  return (
    <div className="flex justify-center mb-4" ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-[#4A7A50] hover:text-[#4A7A50] transition-all"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-[#4A7A50]">
            {lang.toUpperCase()}
          </span>
          <span className="text-gray-400 text-xs">{LANG_NAMES[lang]}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform text-gray-400 ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
            {SUPPORTED_LANGS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                  lang === code
                    ? 'bg-[#E8F2E6] text-[#4A7A50] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider w-6 text-[#4A7A50]">
                  {code.toUpperCase()}
                </span>
                <span>{LANG_NAMES[code]}</span>
                {lang === code && <span className="ml-auto text-[#4A7A50]">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
