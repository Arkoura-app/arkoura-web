'use client'

import {
  createContext, useContext, useState,
  useEffect, useCallback,
} from 'react'
import type { ReactNode } from 'react'
import type { Lang } from '@/lib/i18n'
import { SUPPORTED_LANGS } from '@/lib/i18n'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    // Priority 1: localStorage preference
    const stored = localStorage.getItem('arkoura_lang') as Lang | null
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      setLangState(stored)
      return
    }

    // Priority 2: browser language
    const browserLang = navigator.language.split('-')[0] as Lang
    if (SUPPORTED_LANGS.includes(browserLang)) {
      setLangState(browserLang)
      return
    }

    // Priority 3: fallback to en
    setLangState('en')
  }, [])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('arkoura_lang', newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

// Hook that also accepts a profile language override.
// Used in dashboard where the user's profile language
// takes priority over browser/localStorage.
export function useProfileLang(profileLang?: string | null) {
  const ctx = useContext(LanguageContext)
  const { setLang } = ctx

  useEffect(() => {
    if (profileLang && SUPPORTED_LANGS.includes(profileLang as Lang)) {
      setLang(profileLang as Lang)
    }
  }, [profileLang, setLang])

  return ctx
}
