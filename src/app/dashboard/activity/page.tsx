'use client'
export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { cfFetch } from '@/lib/api'

interface AuditEvent {
  id: string
  action: string
  createdAt: string
  metadata: Record<string, unknown>
}

const ACTION_ICONS: Record<string, string> = {
  emergency_phase2_triggered: '🚨',
  emergency_cancelled: '✅',
  emergency_location_shared: '📍',
  appointment_session_activated: '📅',
  terms_accepted: '📋',
  account_deletion_requested: '⚠️',
  account_deletion_cancelled: '✅',
  data_exported: '📦',
  data_contribution_opted_out: '🔒',
  data_contribution_opted_in: '🔓',
  emergency_scan_alert: 'ℹ️',
}

function getIcon(action: string): string {
  return ACTION_ICONS[action] ?? '📝'
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function formatActionLabel(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export default function ActivityPage() {
  const { lang } = useLang()
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents(cursor?: string) {
    if (cursor) setLoadingMore(true)
    else setLoading(true)
    try {
      const url = cursor
        ? `getAuditLog?limit=20&cursor=${cursor}`
        : 'getAuditLog?limit=20'
      const res = await cfFetch(url)
      const data = await res.json()
      const newEvents: AuditEvent[] = data.events ?? []
      setEvents(prev => (cursor ? [...prev, ...newEvents] : newEvents))
      setNextCursor(data.nextCursor ?? null)
      setHasMore(data.hasMore ?? false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse h-16"
              style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1C2B1E] mb-6">
        {t('nav.activity', lang)}
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500 text-sm">
            {t('activity.noEvents', lang)}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-start gap-3"
              style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)', border: '1px solid #F0F4EE' }}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">
                {getIcon(event.action)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C2B1E]">
                  {formatActionLabel(event.action)}
                </p>
                {event.metadata?.helperName != null && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {String(event.metadata.helperName)}
                    {event.metadata.helperRole != null
                      ? ` · ${String(event.metadata.helperRole)}`
                      : ''}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                {formatRelativeTime(event.createdAt)}
              </span>
            </div>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={() => loadEvents(nextCursor ?? undefined)}
              disabled={loadingMore}
              className="w-full py-3 rounded-2xl text-sm font-medium text-[#4A7A50] border border-[#C8DEC4] hover:bg-[#E8F2E6] transition-colors disabled:opacity-50 mt-2"
            >
              {loadingMore ? '...' : t('activity.loadMore', lang)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
