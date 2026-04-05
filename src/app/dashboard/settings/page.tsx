'use client'
export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { cfFetch } from '@/lib/api'

export default function SettingsPage() {
  const { lang } = useLang()

  // ── Data & Privacy ──
  const [optOut, setOptOut] = useState(false)
  const [optOutLoading, setOptOutLoading] = useState(false)
  const [optOutSaved, setOptOutSaved] = useState(false)

  // ── Export ──
  const [exporting, setExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportSummary, setExportSummary] = useState<{
    conditions: number
    allergies: number
    medications: number
    emergencyContacts: number
    documents: number
    allergyNames: string[]
    medicationNames: string[]
    conditionNames: string[]
    profileFieldsExported: string[]
  } | null>(null)

  // ── Delete Account ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletionScheduled, setDeletionScheduled] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await cfFetch('getProfile')
        const data = await res.json()
        setOptOut(data.anonymizedDataOptOut ?? false)
        if (data.deletionScheduledFor) {
          setDeletionScheduled(
            data.deletionScheduledFor.toDate
              ? data.deletionScheduledFor.toDate().toLocaleDateString()
              : data.deletionScheduledFor
          )
        }
      } catch {
        // non-critical — settings still usable without prefill
      }
    }
    load()
  }, [])

  async function handleToggleOptOut() {
    setOptOutLoading(true)
    const newOptOut = !optOut
    try {
      await cfFetch('toggleDataContribution', {
        method: 'POST',
        body: JSON.stringify({ optOut: newOptOut }),
      })
      setOptOut(newOptOut)
      setOptOutSaved(true)
      setTimeout(() => setOptOutSaved(false), 2000)
    } finally {
      setOptOutLoading(false)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await cfFetch('exportUserData', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.export) {
        // Create a blob and trigger download
        const blob = new Blob(
          [JSON.stringify(data.export, null, 2)],
          { type: 'application/json' }
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `arkoura-export-${
          new Date().toISOString().split('T')[0]
        }.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        if (data.summary) {
          setExportSummary(data.summary)
        }
        setExportSuccess(true)
        setTimeout(() => setExportSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    try {
      const res = await cfFetch('requestAccountDeletion', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setDeletionScheduled(new Date(data.scheduledFor).toLocaleDateString())
        setShowDeleteConfirm(false)
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleCancelDeletion() {
    try {
      await cfFetch('cancelAccountDeletion', { method: 'POST' })
      setDeletionScheduled(null)
    } catch (err) {
      console.error('Cancel deletion error:', err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1C2B1E] mb-8">
        {t('nav.settings', lang)}
      </h1>

      {/* Data & Privacy */}
      <div
        className="bg-white rounded-2xl p-6 mb-4"
        style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)', border: '1px solid #F0F4EE' }}
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t('settings.dataPrivacy', lang)}
        </h2>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1C2B1E]">
              {t('settings.dataContribution', lang)}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {t('settings.dataContributionHint', lang)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleOptOut}
            disabled={optOutLoading}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              !optOut ? 'bg-[#4A7A50]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                !optOut ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
        {optOutSaved && (
          <p className="text-xs text-[#4A7A50] mt-2">
            ✓ {t('settings.saved', lang)}
          </p>
        )}
      </div>

      {/* Export My Data */}
      <div
        className="bg-white rounded-2xl p-6 mb-4"
        style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)', border: '1px solid #F0F4EE' }}
      >
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {t('settings.exportData', lang)}
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          {t('settings.exportDataHint', lang)}
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {exporting ? '...' : `📦 ${t('settings.requestExport', lang)}`}
        </button>

        {exportSuccess && exportSummary && (
          <div className="mt-4 p-4 rounded-2xl bg-[#F4FAF4] border border-[#C8DEC4] space-y-3">
            <p className="text-sm font-semibold text-[#1C2B1E]">
              ✅ {t('settings.exportDownloaded', lang)}
            </p>

            {/* Counts */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🩺', label: t('emergency.conditions', lang), count: exportSummary.conditions },
                { icon: '🌿', label: t('emergency.allergies', lang), count: exportSummary.allergies },
                { icon: '💊', label: t('emergency.medications', lang), count: exportSummary.medications },
                { icon: '👥', label: t('emergency.contacts', lang), count: exportSummary.emergencyContacts },
                { icon: '📄', label: t('settings.documents', lang), count: exportSummary.documents },
              ].map(item => (
                <div key={item.label} className="text-center p-2 bg-white rounded-xl border border-[#E8F2E6]">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-sm font-bold text-[#1C2B1E]">{item.count}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Names preview */}
            {exportSummary.allergyNames.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {t('emergency.allergies', lang)}:
                </p>
                <p className="text-xs text-gray-600">
                  {exportSummary.allergyNames.join(', ')}
                </p>
              </div>
            )}
            {exportSummary.medicationNames.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {t('emergency.medications', lang)}:
                </p>
                <p className="text-xs text-gray-600">
                  {exportSummary.medicationNames.join(', ')}
                </p>
              </div>
            )}
            {exportSummary.conditionNames.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {t('emergency.conditions', lang)}:
                </p>
                <p className="text-xs text-gray-600">
                  {exportSummary.conditionNames.join(', ')}
                </p>
              </div>
            )}

            {/* Privacy note */}
            <p className="text-xs text-gray-400 italic border-t border-[#E8F2E6] pt-2">
              {t('settings.exportPrivacyNote', lang)}
            </p>
          </div>
        )}
      </div>

      {/* Delete Account */}
      {deletionScheduled ? (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-4">
          <p className="text-sm font-medium text-amber-800 mb-2">
            ⏳ {t('settings.deletionScheduled', lang)} {deletionScheduled}
          </p>
          <button
            type="button"
            onClick={handleCancelDeletion}
            className="text-sm text-[#4A7A50] underline"
          >
            {t('settings.cancelDeletion', lang)}
          </button>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl p-6 mb-4"
          style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)', border: '1px solid #F0F4EE' }}
        >
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
            {t('settings.dangerZone', lang)}
          </h2>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              🗑️ {t('settings.deleteAccount', lang)}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600">
                {t('settings.deleteConfirmText', lang)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {deleteLoading ? '...' : t('settings.confirmDelete', lang)}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-500"
                >
                  {t('common.cancel', lang)}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legal */}
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

      <p className="text-xs text-gray-400 text-center mt-8">
        {t('settings.moreComingSoon', lang)}
      </p>
    </div>
  )
}
