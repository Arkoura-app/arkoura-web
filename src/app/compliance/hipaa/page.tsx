'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const SECTIONS = [
  {
    icon: 'ℹ️',
    title: 'Arkoura and HIPAA — Important Context',
    paragraphs: [
      'The Health Insurance Portability and Accountability Act (HIPAA) applies to "covered entities" — healthcare providers, health plans, and healthcare clearinghouses — and their "business associates."',
      'Arkoura is not a covered entity. It is a personal health journal tool — not a healthcare provider, health plan, or clearinghouse. Arkoura does not create, receive, maintain, or transmit Protected Health Information (PHI) as defined by HIPAA on behalf of a covered entity.',
      'US users should understand that data stored in Arkoura is not protected under HIPAA. Arkoura is not a substitute for HIPAA-compliant electronic health record systems.',
    ],
  },
  {
    icon: '✅',
    title: 'Voluntary Alignment with HIPAA Safeguards',
    paragraphs: [
      "Although not legally required to do so, Arkoura voluntarily aligns with HIPAA's safeguard principles because we believe they represent best practice for any platform handling health-related information.",
    ],
  },
  {
    icon: '🔧',
    title: 'Technical Safeguards (§164.312)',
    paragraphs: [
      'Access controls: unique user authentication via Firebase, Firestore rules enforce per-user data isolation.',
      'Audit controls: immutable audit log records all access events, modifications, and deletions.',
      'Integrity controls: Firestore transactions and GCS object versioning protect data integrity.',
      'Transmission security: TLS 1.3 for all data in transit.',
    ],
  },
  {
    icon: '🏢',
    title: 'Administrative Safeguards (§164.308)',
    paragraphs: [
      'Access management: minimum necessary access principle applied — each component accesses only the data it requires.',
      'Security incident response: defined process for detecting and responding to security incidents.',
      'Evaluation: periodic review of security controls.',
    ],
  },
  {
    icon: '🔐',
    title: 'Physical Safeguards (§164.310)',
    paragraphs: [
      'Workstation and device controls: infrastructure hosted on GCP data centers with physical security certifications (ISO 27001, SOC 2).',
      'Media controls: GCS handles secure storage and disposal of storage media.',
    ],
  },
  {
    icon: '⚠️',
    title: 'What This Means for US Users',
    paragraphs: [
      'Information you enter in Arkoura is your personal health journal — not a clinical record protected under HIPAA.',
      'If you share Appointment Mode access with a healthcare provider, they should treat the information as patient self-reported context, not as a HIPAA-covered record.',
      'For questions: legal@arkoura.com',
    ],
  },
]

export default function HIPAAPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">HIPAA Alignment</h1>
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
