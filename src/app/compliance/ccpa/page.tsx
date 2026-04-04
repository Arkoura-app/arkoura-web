'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const SECTIONS = [
  {
    icon: '🌴',
    title: 'California Consumer Privacy Act',
    paragraphs: [
      'The California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), grants California residents specific rights regarding their personal information. This page describes how Arkoura complies with CCPA.',
    ],
  },
  {
    icon: '📋',
    title: 'Personal Information We Collect',
    paragraphs: [
      'Category A — Identifiers: name, email, phone, IP address, Firebase user ID.',
      'Category B — Personal records: date of birth, health conditions, medications, allergies.',
      'Category C — Internet activity: app usage patterns (anonymized).',
      'Category H — Health information: all journal entries and health data (treated as sensitive personal information).',
    ],
  },
  {
    icon: '🚫',
    title: 'We Do Not Sell Your Personal Information',
    paragraphs: [
      'Arkoura does not sell, rent, or share your personal information with third parties for their commercial purposes. This applies to all California residents. We do not have a "Do Not Sell" opt-out because we do not sell.',
    ],
  },
  {
    icon: '⚡',
    title: 'Your CCPA Rights',
    paragraphs: [
      'Right to Know: request disclosure of the categories and specific pieces of personal information collected about you.',
      'Right to Delete: request deletion of your personal information (subject to exceptions).',
      'Right to Correct: request correction of inaccurate personal information.',
      'Right to Opt-Out of Sale: not applicable — we do not sell.',
      'Right to Non-Discrimination: exercising your CCPA rights will not result in denial of service or different pricing.',
      'Rights related to Sensitive Personal Information: you may direct Arkoura to limit use of sensitive personal information (health data) to service provision only.',
    ],
  },
  {
    icon: '📬',
    title: 'How to Submit a Request',
    paragraphs: [
      'Email: privacy@arkoura.com',
      'Subject line: "CCPA Privacy Request"',
      'Include: your name, account email, and specific right you are exercising.',
      'Response time: within 45 days (extendable by an additional 45 days with notice).',
      'Verification: we will verify your identity before processing deletion or disclosure requests.',
    ],
  },
  {
    icon: '🔬',
    title: 'Anonymized Research Data',
    paragraphs: [
      'You may opt out of Arkoura using anonymized and aggregated data for research purposes. Contact privacy@arkoura.com to opt out. This will not affect your ability to use the service.',
    ],
  },
  {
    icon: '📅',
    title: 'Effective Date',
    paragraphs: [
      'This CCPA notice is effective as of April 3, 2026. We will update it when our practices change materially.',
    ],
  },
]

export default function CCPAPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">CCPA Compliance</h1>
        <p className="text-sm text-gray-500 mb-8">Last reviewed: April 2026</p>

        <div className="space-y-10">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="text-base font-bold text-[#1C2B1E] mb-3 flex items-center gap-2">
                <span>{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#F0F4EE] text-xs text-gray-400 text-center">
          © 2026 Arkoura · San José, Costa Rica
        </div>
      </div>
    </div>
  )
}
