'use client'
export const runtime = 'edge'

import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'

export default function SettingsPage() {
  const { lang } = useLang()

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1C2B1E] mb-8">
        {t('nav.settings', lang)}
      </h1>

      {/* Legal section */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)', border: '1px solid #F0F4EE' }}
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t('settings.legal', lang)}
        </h2>
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-sm text-[#4A7A50] hover:underline"
        >
          <span className="text-lg">📄</span>
          {t('terms.title', lang)}
        </a>
      </div>

      {/* Placeholder for future settings sections */}
      <p className="text-xs text-gray-400 text-center mt-8">
        {t('settings.moreComingSoon', lang)}
      </p>
    </div>
  )
}
