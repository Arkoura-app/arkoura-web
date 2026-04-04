'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const SECTIONS = [
  {
    icon: '🏗️',
    title: 'Infrastructure Security',
    paragraphs: [
      "Arkoura's infrastructure is designed with security at every layer:",
      'Google Cloud Platform (GCP): enterprise-grade cloud hosting with VPC network isolation, IAM role-based access control, and SOC 2 / ISO 27001 certified data centers.',
      'Cloudflare Pages: CDN delivery with built-in DDoS protection, WAF (Web Application Firewall), and TLS termination at the edge.',
      'Firebase / Firestore: managed database with per-document security rules enforced server-side — no client can bypass them.',
      'Google Cloud Storage: private buckets with no public access — all file access requires server-generated signed URLs.',
      'GCP Secret Manager: all API keys, tokens, and credentials stored in Secret Manager — never in source code or environment files.',
    ],
  },
  {
    icon: '🔐',
    title: 'Application Security',
    paragraphs: [
      'Authentication: Firebase Authentication handles all user identity (email/password, Google, Apple) with industry-standard secure token management.',
      'Route protection: all dashboard routes protected by middleware that validates Firebase Auth tokens on every request.',
      'Firestore security rules: every read and write operation validates that the authenticated userId matches the document owner — cross-user data access is impossible at the database rule level.',
      'QR token architecture: emergency profile URLs use a 12-character CSPRNG token — non-sequential, non-guessable, decoupled from internal user IDs, preventing enumeration attacks (~62^12 possible values).',
    ],
  },
  {
    icon: '🔒',
    title: 'Data Security',
    paragraphs: [
      'Encryption at rest: AES-256 for all Firestore data and GCS file storage.',
      'Encryption in transit: TLS 1.3 for all client-server communication.',
      'Profile photos and documents: stored in private GCS buckets, accessed only via signed URLs with 1-hour expiry — the server verifies document ownership before generating any signed URL.',
      'No plaintext secrets: OTPs, tokens, and sensitive values are stored as SHA-256 hashes — originals are never persisted.',
    ],
  },
  {
    icon: '🚨',
    title: 'Emergency Access Security',
    paragraphs: [
      'Two-phase notification: Phase 1 fires an informational alert on every QR scan; Phase 2 fires a high-urgency alert only when a helper explicitly confirms an emergency.',
      'Dual OTP for Appointment Mode: a public OTP is sent to the requesting party; a separate private OTP is sent exclusively to the profile holder — the profile holder must actively share their private OTP, making surprise full-journal access sessions impossible.',
      'OTP security: 6-digit cryptographically random codes, SHA-256 hashed before storage, 1-hour expiry, single-use, 3-attempt limit before automatic session invalidation.',
      'Session isolation: each emergency and appointment session is scoped to a single QR token and profile — no session can access data across profiles.',
    ],
  },
  {
    icon: '🛡️',
    title: 'Attack Prevention',
    paragraphs: [
      'Enumeration prevention: no sequential IDs in public-facing URLs — all external identifiers are random tokens.',
      'CORS policy: Cloud Functions restrict cross-origin requests to Arkoura domains.',
      'Rate limiting: Cloud Functions enforce request rate limits to prevent abuse.',
      'AI scope guardrail: the journal AI validates every incoming message against the profile scope — prompt injection attempts to access other users\' data are detected and refused.',
      'Account quarantine: deletion requests enter a 30-day quarantine before permanent erasure, protecting against accidental or malicious account deletion.',
    ],
  },
  {
    icon: '📋',
    title: 'Audit Logging',
    paragraphs: [
      'An immutable audit log records every security-relevant event:',
      'Emergency Mode sessions (trigger, outcome, cancellation).',
      'Appointment Mode sessions (OTP generation, validation attempts, activation).',
      'Journal entry edits and deletions.',
      'Document uploads and access.',
      'Family account linking and dissolution.',
      'Account security events (password changes, new device sign-ins).',
      'The complete audit log is accessible to the authenticated profile holder at all times within their dashboard.',
    ],
  },
  {
    icon: '📧',
    title: 'Security Contact',
    paragraphs: [
      'To report a security vulnerability or concern:',
      'legal@arkoura.com',
      'Subject: "Security Report"',
      'We commit to acknowledging reports within 48 hours.',
    ],
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">Security Standards</h1>
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
