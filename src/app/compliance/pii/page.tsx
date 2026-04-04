'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const SECTIONS = [
  {
    icon: '🔒',
    title: 'What is PII and What We Collect',
    paragraphs: [
      'Personally Identifiable Information (PII) is any data that can identify you directly or indirectly. Arkoura collects:',
      'Direct identifiers: full name, email, phone number, date of birth, profile photo.',
      'Health data: conditions, allergies, medications, emergency contacts, journal entries, uploaded documents.',
      'Technical identifiers: Firebase user ID (internal only, never exposed publicly).',
    ],
  },
  {
    icon: '🛡️',
    title: 'How We Protect Your PII',
    paragraphs: [
      'Encryption at rest: AES-256 encryption for all data stored in Firestore and Google Cloud Storage.',
      'Encryption in transit: TLS 1.3 for all data transmitted between your device and our servers.',
      'Access controls: Firebase Authentication ensures every data read/write is validated against your authenticated user ID via Firestore security rules — no other user can access your data.',
      'Photo storage: profile photos are stored in a private GCS bucket and accessed only via signed URLs that expire after 1 hour.',
      'Document storage: uploaded health documents follow the same signed URL pattern — only you can generate access URLs for your files.',
    ],
  },
  {
    icon: '🔗',
    title: 'QR Token Architecture',
    paragraphs: [
      'Your QR code contains a URL with a 12-character cryptographic hash token. This token is:',
      'Generated once at account creation using a cryptographically secure random number generator (CSPRNG).',
      'Completely decoupled from your internal user ID — scanning your QR code never exposes your Firebase UID or any PII.',
      'Non-sequential and non-guessable — approximately 62^12 possible values.',
      'The only link between your QR code and your profile is a server-side lookup table inaccessible to the public.',
    ],
  },
  {
    icon: '📉',
    title: 'Data Minimization',
    paragraphs: [
      'We collect only what is necessary to provide the Arkoura service. Health data is entirely optional and user-controlled — you choose what to enter and what to share on your emergency profile.',
    ],
  },
  {
    icon: '🔬',
    title: 'Anonymized Research Use',
    paragraphs: [
      'Before any health data is used for research or platform improvement, it is fully anonymized: all direct and indirect identifiers are removed. Anonymized data cannot be traced back to any individual. You may opt out of anonymized research use by contacting privacy@arkoura.com.',
    ],
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Third-Party Access',
    paragraphs: [
      'Arkoura does not sell your PII to third parties. Limited data is shared with:',
      'Twilio (WhatsApp/SMS notifications): phone numbers for delivery only.',
      'Resend (email delivery): email addresses for delivery only.',
      'Google Cloud (hosting/storage): encrypted data storage.',
      'Anthropic (AI processing): journal content for AI responses — not stored or used for training by Anthropic under our data processing agreement.',
    ],
  },
]

export default function PIIPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">PII Protection</h1>
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
