'use client'

import { useLang } from '@/contexts/LanguageContext'
import { SUPPORTED_LANGS, LANG_NAMES } from '@/lib/i18n'

export function LanguagePicker() {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {SUPPORTED_LANGS.map(code => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              lang === code
                ? 'bg-white text-[#1C2B1E] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={LANG_NAMES[code]}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
