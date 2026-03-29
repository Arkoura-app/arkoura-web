'use client'

import type { ReactNode } from 'react'

interface RecordCardProps {
  title: string
  subtitle?: string
  badge?: ReactNode
  isCritical?: boolean
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function RecordCard({
  title,
  subtitle,
  badge,
  isCritical,
  onEdit,
  onDelete,
  isDeleting,
}: RecordCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border transition-colors ${
        isCritical ? 'bg-red-50/40 border-red-100' : 'bg-white border-gray-100'
      }`}
      style={{ boxShadow: '0 1px 2px rgba(28,43,30,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-[#1C2B1E]">{title}</p>
            {isCritical && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                ⚠ Critical
              </span>
            )}
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-[#4A7A50] hover:bg-[#4A7A50]/8 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            {isDeleting ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
