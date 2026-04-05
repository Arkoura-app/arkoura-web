'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t, type Lang } from '@/lib/i18n'

export function InstallPrompt() {
  const { lang } = useLang()
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)

  useEffect(() => {
    // Only show on mobile/tablet
    if (window.innerWidth >= 1024) return

    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Already dismissed this session
    if (sessionStorage.getItem('installPromptDismissed')) return

    // Detect iOS Safari
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as typeof window & { MSStream?: unknown }).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      setShow(true)
      return
    }

    // Android Chrome — listen for install event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> })
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleDismiss() {
    sessionStorage.setItem('installPromptDismissed', '1')
    setShow(false)
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:bottom-4 md:left-4 md:right-auto md:max-w-sm">
      <div
        className="bg-white border-t border-gray-200 md:border md:rounded-2xl shadow-xl px-4 py-4"
        style={{ boxShadow: '0 -4px 24px rgba(28,43,30,0.10)' }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E8F2E6] flex items-center justify-center text-xl">
            📱
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1C2B1E]">
              {t('pwa.title', lang as Lang)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {isIOS
                ? t('pwa.iosInstructions', lang as Lang)
                : t('pwa.androidInstructions', lang as Lang)
              }
            </p>
            {!isIOS && deferredPrompt && (
              <button
                type="button"
                onClick={() => void handleInstall()}
                className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(145deg,#44664a,#7a9e7e)' }}
              >
                {t('pwa.install', lang as Lang)}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
