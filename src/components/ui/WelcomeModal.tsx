'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t, type Lang } from '@/lib/i18n'

export function WelcomeModal() {
  const { lang } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('welcomeShown')) return
    if (sessionStorage.getItem('justRegistered')) {
      setShow(true)
      sessionStorage.removeItem('justRegistered')
      sessionStorage.setItem('welcomeShown', '1')
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">

        {/* Green header */}
        <div
          className="px-8 pt-10 pb-6 text-center"
          style={{ background: 'linear-gradient(160deg,#1C2B1E,#4A7A50)' }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="text-3xl">🛡️</span>
          </div>
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {t('welcome.title', lang as Lang)}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            {t('welcome.subtitle', lang as Lang)}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-4">

          {/* Step list */}
          {[
            { icon: '👤', key: 'welcome.step1' },
            { icon: '🚨', key: 'welcome.step2' },
            { icon: '📱', key: 'welcome.step3' },
          ].map(step => (
            <div key={step.key} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{step.icon}</span>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(step.key, lang as Lang)}
              </p>
            </div>
          ))}

          {/* CTA */}
          <button
            type="button"
            onClick={() => setShow(false)}
            className="w-full mt-2 py-3 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(145deg,#44664a,#7a9e7e)' }}
          >
            {t('welcome.cta', lang as Lang)}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {t('welcome.reminder', lang as Lang)}
          </p>
        </div>
      </div>
    </div>
  )
}
