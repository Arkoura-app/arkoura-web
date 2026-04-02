'use client'
export const runtime = 'edge'

import { useCallback, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cfFetch } from '@/lib/api'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'
import { auth } from '@/lib/firebase'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'

interface QrData {
  token: string
  qrUrl: string
  dataUrl: string
}

export default function QrPage() {
  const { lang } = useLang()
  const [qr, setQr] = useState<QrData | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  const loadQr = useCallback(async () => {
    setLoadError(false)
    try {
      const idToken = await auth?.currentUser?.getIdToken()
      if (!idToken) return
      const res = await fetch(`${CF_FUNCTIONS_BASE}/getQrCode?format=base64`, {
        headers: { Authorization: `Bearer ${idToken}` },
      })
      if (!res.ok) throw new Error('Failed to load QR')
      const data = (await res.json()) as QrData
      setQr(data)
    } catch {
      setLoadError(true)
    }
  }, [])

  useEffect(() => {
    void loadQr()
  }, [loadQr])

  async function copyUrl() {
    if (!qr) return
    await navigator.clipboard.writeText(qr.qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function downloadQr() {
    const token = await auth?.currentUser?.getIdToken()
    if (!token) return
    const res = await fetch(`${CF_FUNCTIONS_BASE}/getQrCode`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'arkoura-qr.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function share() {
    if (!qr || !navigator.share) return
    await navigator.share({
      title: 'My Arkoura Emergency Profile',
      text: 'Scan for my emergency health information',
      url: qr.qrUrl,
    })
  }

  async function confirmRegenerate() {
    setRegenerating(true)
    try {
      const res = await cfFetch('regenerateQrToken', { method: 'POST' })
      if (res.ok) window.location.reload()
    } finally {
      setRegenerating(false)
      setConfirmOpen(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1C2B1E]">{t('qr.title', lang)}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('qr.subtitle', lang)}
        </p>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center mb-4">
        {qr ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.dataUrl}
              alt="Your emergency profile QR code"
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl"
            />
            <p className="mt-4 text-xs font-mono text-gray-400 max-w-full px-2 text-center truncate">
              arkoura.com/e/{qr.token}
            </p>
          </>
        ) : loadError ? (
          <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center rounded-xl bg-gray-50">
            <p className="text-sm text-gray-400 text-center px-4">
              Failed to load QR code.{' '}
              <button
                onClick={() => void loadQr()}
                className="underline text-[#4A7A50]"
              >
                Retry
              </button>
            </p>
          </div>
        ) : (
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl bg-gray-100 animate-pulse" />
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 mb-4">
        <button
          onClick={() => void copyUrl()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8EDE8] bg-white hover:bg-[#F4F6F2] text-sm font-medium text-[#1C2B1E] transition-colors"
        >
          <ClipboardIcon />
          <span className={copied ? 'text-[#4A7A50]' : ''}>
            {copied ? t('qr.copied', lang) : t('qr.copyUrl', lang)}
          </span>
        </button>

        <button
          onClick={() => void downloadQr()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8EDE8] bg-white hover:bg-[#F4F6F2] text-sm font-medium text-[#1C2B1E] transition-colors"
        >
          <DownloadIcon />
          {t('qr.download', lang)}
        </button>

        {canShare && (
          <button
            onClick={() => void share()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8EDE8] bg-white hover:bg-[#F4F6F2] text-sm font-medium text-[#1C2B1E] transition-colors"
          >
            <ShareIcon />
            {t('qr.share', lang)}
          </button>
        )}

        <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8EDE8] bg-white hover:bg-[#F4F6F2] text-sm font-medium text-red-600 transition-colors">
              <RefreshIcon />
              {t('qr.regenerate', lang)}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl focus:outline-none">
              <Dialog.Title className="text-base font-bold text-[#1C2B1E] mb-2">
                {t('qr.regenerateTitle', lang)}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mb-5">
                {t('qr.regenerateWarning', lang)}
              </Dialog.Description>
              <div className="flex gap-2 justify-end">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#1C2B1E] hover:bg-gray-50 transition-colors">
                    {t('common.cancel', lang)}
                  </button>
                </Dialog.Close>
                <button
                  onClick={() => void confirmRegenerate()}
                  disabled={regenerating}
                  className="px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {regenerating ? '…' : t('qr.regenerateConfirm', lang)}
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Static URL card */}
      {qr && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">{t('qr.emergencyUrlTitle', lang)}</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={`https://arkoura.com/e/${qr.token}`}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono text-[#1C2B1E] bg-gray-50 focus:outline-none truncate"
            />
            <button
              onClick={() => void copyUrl()}
              className="flex-shrink-0 px-3 py-2 rounded-xl border border-[#E8EDE8] bg-white hover:bg-[#F4F6F2] text-sm font-medium text-[#1C2B1E] transition-colors"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('qr.urlNote', lang)}
          </p>
        </div>
      )}

      {/* Tips card */}
      <div className="bg-[#E8F2E6] rounded-2xl p-4">
        <p className="text-sm font-semibold text-[#1C2B1E] mb-2">{t('qr.tipTitle', lang)}</p>
        <ul className="space-y-1 text-sm text-[#3a5e40]">
          <li>• {t('qr.tip1', lang)}</li>
          <li>• {t('qr.tip2', lang)}</li>
          <li>• {t('qr.tip3', lang)}</li>
          <li>• {t('qr.tip4', lang)}</li>
        </ul>
      </div>
    </div>
  )
}

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}
