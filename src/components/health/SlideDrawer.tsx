'use client'

import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface SlideDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

export function SlideDrawer({ open, onOpenChange, title, children }: SlideDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-2xl overflow-y-auto focus:outline-none"
          style={{ animation: 'slideInRight 0.25s ease' }}
        >
          <Dialog.Description className="sr-only">
            Form to manage your health record
          </Dialog.Description>

          {/* Sticky header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <Dialog.Title className="font-[var(--font-manrope)] text-base font-bold text-[#1C2B1E]">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="p-1.5 rounded-xl text-gray-400 hover:text-[#1C2B1E] hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="px-6 py-5 pb-10">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
