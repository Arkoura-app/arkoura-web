'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { t } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'

interface Props {
  title: string
  subtitle?: string
  badge?: { label: string; color: string; bg: string }
  isCritical?: boolean
  children: ReactNode
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
  lang?: string
}

export function RecordCardNew({
  title,
  subtitle,
  badge,
  isCritical,
  children,
  onEdit,
  onDelete,
  isDeleting,
  lang = 'en',
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div
      className={`rounded-2xl bg-white overflow-hidden transition-all ${
        isCritical ? 'border border-red-100' : 'border border-[#F0F4EE]'
      }`}
      style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[#FAFAF8] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-[#1C2B1E] truncate">
              {title}
            </p>
            {isCritical && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium flex-shrink-0">
                ⚠️
              </span>
            )}
            {badge && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#F0F4EE] pt-3 space-y-2">
          {children}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4A7A50] border border-[#4A7A50]/30 hover:bg-[#E8F2E6] transition-colors"
            >
              ✏️ {t('form.edit', lang as Lang)}
            </button>
            {confirmDelete ? (
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {isDeleting ? '...' : t('form.confirm', lang as Lang)}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel', lang as Lang)}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
              >
                🗑️ {t('form.delete', lang as Lang)}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
