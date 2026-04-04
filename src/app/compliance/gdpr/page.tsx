'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const SECTIONS = [
  {
    icon: '🏛️',
    title: 'Overview',
    paragraphs: [
      'Arkoura processes personal data in compliance with Regulation (EU) 2016/679 (GDPR). This page explains how we collect, process, and protect the personal data of users in the European Union and European Economic Area.',
    ],
  },
  {
    icon: '⚖️',
    title: 'Lawful Basis for Processing',
    paragraphs: [
      'We process your personal data under the following legal bases:',
      'General account data (name, email, phone): Contractual necessity (Article 6(1)(b)) — required to provide the Arkoura service.',
      'Health and journal data: Explicit consent (Article 9(2)(a)) — you provide this voluntarily and may withdraw consent at any time by deleting your account.',
      'Anonymized research data: Legitimate interest (Article 6(1)(f)) — used to improve the platform; you may opt out at any time.',
    ],
  },
  {
    icon: '📋',
    title: 'Your Rights as a Data Subject',
    paragraphs: [
      'Under GDPR you have the following rights:',
      'Right of access (Article 15): Request a copy of all personal data we hold about you.',
      'Right to rectification (Article 16): Correct inaccurate or incomplete data.',
      'Right to erasure (Article 17): Request deletion of your data. Account deletion requests enter a 30-day quarantine period before permanent erasure.',
      'Right to restriction (Article 18): Request that we limit processing of your data.',
      'Right to data portability (Article 20): Receive your data in a machine-readable format.',
      'Right to object (Article 21): Object to processing based on legitimate interest.',
      'Rights related to automated decision-making (Article 22): Arkoura does not make automated decisions with legal or similarly significant effects.',
      'To exercise any right: privacy@arkoura.com',
    ],
  },
  {
    icon: '🗂️',
    title: 'Data We Collect',
    paragraphs: [
      'Identity data: name, date of birth, profile photo.',
      'Contact data: email address, phone number.',
      'Health journal data: conditions, allergies, medications, emergency contacts, journal entries, uploaded documents.',
      'Technical data: IP address, browser type, device identifiers, access logs.',
      'Usage data: feature usage patterns (anonymized).',
    ],
  },
  {
    icon: '⏱️',
    title: 'Retention Periods',
    paragraphs: [
      'Account data: retained while your account is active, deleted 30 days after account deletion request.',
      'Audit logs: retained for 24 months for security and compliance purposes.',
      'Anonymized research data: indefinitely (no PII, not subject to erasure).',
    ],
  },
  {
    icon: '🌍',
    title: 'International Data Transfers',
    paragraphs: [
      "Arkoura's infrastructure is hosted on Google Cloud Platform (GCP) with primary processing in the United States. Data transfers from the EU/EEA to the US are conducted under Standard Contractual Clauses (SCCs) as approved by the European Commission.",
    ],
  },
  {
    icon: '📣',
    title: 'Supervisory Authority',
    paragraphs: [
      'EU/EEA users have the right to lodge a complaint with their national data protection authority. A directory of EU supervisory authorities is available at: https://edpb.europa.eu',
    ],
  },
  {
    icon: '📧',
    title: 'Data Controller & DPO Contact',
    paragraphs: [
      'Data Controller: Arkoura',
      'Privacy contact: privacy@arkoura.com',
      'For GDPR-specific requests, include "GDPR Request" in the subject line.',
    ],
  },
]

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">GDPR Compliance</h1>
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
