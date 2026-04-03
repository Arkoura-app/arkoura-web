'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const sections = [
  {
    number: 1,
    title: 'Introduction and Acceptance',
    content: (
      <>
        <p>The Arkoura application is operated by Arkoura.</p>
        <p>By registering for or using the Arkoura application, you agree to be bound by these Terms and Conditions in their entirety. These Terms constitute a legally binding agreement between you and Arkoura. If you do not accept these Terms in full, you must not register for or use the service.</p>
        <p>These Terms are effective as of April 3, 2026.</p>
      </>
    ),
  },
  {
    number: 2,
    title: 'What Arkoura Is — and Is Not',
    content: (
      <>
        <p>Arkoura is a <strong>personal health journal and emergency communication platform</strong> designed to help individuals record and share health information in personal and emergency contexts.</p>
        <p>Arkoura is <strong>not</strong> any of the following:</p>
        <ul>
          <li>A medical device under U.S. Food and Drug Administration (FDA) regulations, CE marking requirements, the EU Medical Device Regulation (MDR), or any equivalent national medical device regulatory framework.</li>
          <li>A medical record system, Electronic Health Record (EHR) system, or clinical record platform.</li>
          <li>A healthcare provider, medical practice, pharmacy, or clinical laboratory.</li>
          <li>A provider of medical diagnosis, clinical assessment, treatment recommendations, or medical advice of any kind.</li>
        </ul>
        <p>All information stored in Arkoura represents the profile holder&apos;s <strong>personal recollection of health events and experiences</strong> — not clinically verified, authenticated, or validated data.</p>
        <p>Arkoura does not replace consultation with a qualified healthcare professional. Users should always seek the advice of a licensed medical professional regarding any medical condition or health concern.</p>
        <p className="font-semibold">In a medical emergency, immediately contact your local emergency services (911, 112, or the equivalent number in your jurisdiction).</p>
      </>
    ),
  },
  {
    number: 3,
    title: 'User Accounts and Eligibility',
    content: (
      <>
        <p><strong>Age Requirement.</strong> You must be at least 18 years of age, or the minimum age of legal majority in your jurisdiction, to register for and use Arkoura independently.</p>
        <p><strong>Minors.</strong> Minors may have accounts created and managed on their behalf by a legal guardian through the Family Group Account feature, as described in Section 11.</p>
        <p><strong>Account Security.</strong> You are solely responsible for maintaining the confidentiality of your account credentials, including your password and QR code. You are responsible for all activity that occurs under your account, whether or not authorized by you. You must notify Arkoura immediately of any unauthorized use of your account.</p>
      </>
    ),
  },
  {
    number: 4,
    title: 'Personal Health Journal — User Responsibilities',
    content: (
      <>
        <p>By entering information into your Arkoura health journal, you represent and acknowledge the following:</p>
        <ol>
          <li>All journal entries, health data, and uploaded documents reflect your genuine personal recollection of health events and experiences, to the best of your knowledge.</li>
          <li>Arkoura does not verify, validate, authenticate, or cross-reference any information or document you enter or upload.</li>
          <li>You are solely responsible for the accuracy and completeness of your health record. Arkoura is a journal tool — the quality of the information it contains depends entirely on you.</li>
          <li>Entering deliberately false, fabricated, or misleading health information that is subsequently shared with emergency responders, healthcare providers, or other third parties may constitute fraud, obstruction of emergency services, or other criminal or civil offenses under applicable law. <strong>The profile holder bears sole legal responsibility for any such conduct.</strong></li>
        </ol>
      </>
    ),
  },
  {
    number: 5,
    title: 'Document Upload and Authenticity',
    content: (
      <>
        <p>Arkoura accepts document uploads — including PDFs, images, clinical letters, laboratory results, and prescriptions — as submitted, without any form of verification.</p>
        <p>Arkoura does not authenticate, validate, or verify the origin, accuracy, or integrity of any document uploaded by a user.</p>
        <p><strong>By uploading a document to Arkoura, the profile holder or caretaker represents and warrants that:</strong></p>
        <ol type="a">
          <li>the document is genuine and has not been falsified, altered, fabricated, or tampered with in any manner;</li>
          <li>they hold the legal right to upload and share the document; and</li>
          <li>the document does not infringe upon the rights of any third party.</li>
        </ol>
        <p>Any AI-generated, falsified, altered, forged, or tampered document uploaded to Arkoura is the <strong>sole legal and financial responsibility</strong> of the profile holder or caretaker who uploaded it. Arkoura is not liable for the retransmission of falsified or inaccurate information to emergency contacts, healthcare providers, or emergency responders where such information originated from documents uploaded by a user.</p>
      </>
    ),
  },
  {
    number: 6,
    title: 'Emergency Access and QR Code',
    content: (
      <>
        <p>The Arkoura QR code emergency profile is designed to assist emergency responders by providing access to a user&apos;s self-reported health information. The following limitations apply:</p>
        <ul>
          <li>Arkoura does not guarantee that the QR code emergency profile will produce any specific emergency response or outcome.</li>
          <li>Arkoura does not guarantee that emergency contacts will receive, read, or act upon notifications sent through the platform.</li>
          <li>Arkoura does not guarantee the availability, accuracy, or timeliness of notifications transmitted via third-party services, including email, WhatsApp, or SMS.</li>
          <li>Helpers, emergency responders, and healthcare providers who access the emergency profile do so at their own professional or personal discretion. Arkoura is not responsible for any decisions made on the basis of information contained in the emergency profile.</li>
          <li>The emergency profile contains <strong>self-reported information only</strong> — it is not a substitute for a complete clinical assessment by a qualified healthcare professional.</li>
        </ul>
      </>
    ),
  },
  {
    number: 7,
    title: 'AI-Assisted Features and Limitations',
    content: (
      <>
        <p>Arkoura incorporates artificial intelligence to assist with journal entry creation, document data extraction, and conversational queries about journal content. The following conditions apply to all AI-assisted features:</p>
        <ul>
          <li>AI responses are generated solely from information the profile holder has entered into their journal. They do not constitute medical advice, clinical assessment, or diagnosis.</li>
          <li>AI responses may contain errors, omissions, or inaccuracies. Users must not rely on AI-generated responses for any medical decision.</li>
          <li>The AI is explicitly scoped to the journal&apos;s contents — it does not access, and cannot access, external medical databases, clinical guidelines, real-time health information, or any information outside the profile holder&apos;s own journal.</li>
          <li>Session transcripts are stored and accessible to the profile holder. They may be reviewed by Arkoura for quality assurance and safety improvement purposes.</li>
        </ul>
      </>
    ),
  },
  {
    number: 8,
    title: 'Appointment Mode and Helper Access',
    content: (
      <>
        <p>Arkoura&apos;s Appointment Mode enables a profile holder to grant a third party — such as a healthcare provider — limited, time-scoped access to their personal health journal via a one-time password (OTP) mechanism. The following conditions apply:</p>
        <ul>
          <li>Information accessed in Appointment Mode is <strong>patient self-reported</strong> and must not be treated as a verified clinical record or used as a substitute for professional clinical assessment.</li>
          <li>Healthcare providers accessing journal information via Appointment Mode acknowledge that the information presented has not been clinically verified. They must exercise independent professional judgment in all clinical decisions.</li>
          <li>Arkoura is not liable for any clinical decision made by a healthcare provider based on information accessed through Appointment Mode.</li>
          <li>The profile holder retains full control over Appointment Mode access through the OTP sharing mechanism.</li>
        </ul>
      </>
    ),
  },
  {
    number: 9,
    title: 'Data, Privacy, and Anonymized Use',
    content: (
      <>
        <p>Arkoura collects and processes personal health data as described in the Arkoura Privacy Policy, which is incorporated by reference into these Terms.</p>
        <p><strong>Anonymized Data Use.</strong> By using Arkoura, you consent to Arkoura using fully anonymized and aggregated health data — from which all personally identifying information has been removed — for the following purposes:</p>
        <ol type="a">
          <li>improving Arkoura&apos;s AI models and product features;</li>
          <li>identifying trends in health conditions, symptoms, and medication usage patterns to support medical research;</li>
          <li>contributing anonymized insights to public health initiatives and academic research; and</li>
          <li>improving emergency response protocols.</li>
        </ol>
        <p>No data that could identify an individual is shared externally as part of these activities.</p>
        <p><strong>Opt-Out.</strong> Users may opt out of the use of their anonymized data for research purposes by submitting a written request to support@arkoura.com. Opting out does not affect the user&apos;s ability to access or use the service.</p>
        <p>Data retention, deletion, and portability rights are described in the Privacy Policy.</p>
      </>
    ),
  },
  {
    number: 10,
    title: 'Regulatory Jurisdiction Notes',
    content: (
      <>
        <p className="font-semibold mt-4">GDPR — European Union and European Economic Area</p>
        <p>Arkoura processes personal data as a <strong>data controller</strong> as defined under Regulation (EU) 2016/679 (GDPR), Article 4. Legal basis: user consent under Article 6(1)(a); explicit consent under Article 9(2)(a) for the processing of health data as a special category of personal data. EU/EEA users have rights of access, rectification, erasure, restriction, portability, and objection. Data Protection Officer: privacy@arkoura.com.</p>

        <p className="font-semibold mt-4">HIPAA — United States</p>
        <p>Arkoura is <strong>not a HIPAA covered entity</strong> and is not acting as a business associate of any covered entity as defined under HIPAA. Arkoura does not create, receive, maintain, or transmit Protected Health Information (PHI) as defined under HIPAA. US users are advised that information entered into Arkoura is not protected under HIPAA.</p>

        <p className="font-semibold mt-4">CCPA — California, United States</p>
        <p>California residents have the right to know what personal information is collected, to request deletion, and to opt out of the sale of personal information. Arkoura does not sell personal information. Requests may be submitted to privacy@arkoura.com.</p>

        <p className="font-semibold mt-4">LGPD — Brazil</p>
        <p>Brazilian users&apos; personal data is processed in accordance with Lei Geral de Proteção de Dados Pessoais (LGPD), Law No. 13,709/2018. Legal basis: user consent and legitimate interest for service provision. Data subjects retain all rights afforded under the LGPD.</p>

        <p className="font-semibold mt-4">PDPL — Costa Rica (Law 8968)</p>
        <p>Arkoura complies with the Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales, Law No. 8968. Users have rights of access, rectification, and cancellation under Costa Rican data protection law. Regulatory authority: PRODHAB — Agencia de Protección de Datos de los Habitantes.</p>
      </>
    ),
  },
  {
    number: 11,
    title: 'Family Group Accounts',
    content: (
      <>
        <p>Arkoura&apos;s Family Group Account feature allows a master account holder to create and manage sub-accounts on behalf of other individuals.</p>
        <ul>
          <li>Master account holders are responsible for ensuring that health data entered for sub-account holders is accurate and current.</li>
          <li>Master account holders must have the legal authority to manage health information on behalf of the sub-account holder — including, as applicable, parental authority, legal guardianship, or power of attorney.</li>
          <li>Sub-account holders retain sovereignty over their own account and may dissolve the relationship with the master account at any time.</li>
        </ul>
      </>
    ),
  },
  {
    number: 12,
    title: 'Limitation of Liability',
    content: (
      <>
        <p>Arkoura is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
        <p>To the maximum extent permitted by applicable law, Arkoura and its operator shall not be liable for:</p>
        <ol type="a">
          <li>any medical outcome resulting from information shared via the platform, whether accurate or inaccurate;</li>
          <li>failure of emergency notifications to reach their intended recipients;</li>
          <li>any decision made by a helper, healthcare provider, or emergency responder based on information accessed through the platform;</li>
          <li>errors, omissions, or inaccuracies in AI-generated responses;</li>
          <li>unauthorized access to a user&apos;s account resulting from the user&apos;s failure to protect their credentials, QR code, or OTP.</li>
        </ol>
        <p><strong>Cap on Liability.</strong> Arkoura&apos;s total aggregate liability to any user shall not exceed the total amount paid by the user to Arkoura in the twelve (12) months immediately preceding the event giving rise to the claim.</p>
        <p>Nothing in this Section limits liability that cannot be excluded under applicable mandatory law.</p>
      </>
    ),
  },
  {
    number: 13,
    title: 'Intellectual Property',
    content: (
      <>
        <p>The Arkoura application, including its content, features, user interface design, and underlying technology, is owned by Arkoura and is protected by applicable intellectual property laws, including copyright, trademark, and trade secret law.</p>
        <p>Users retain full ownership of all health data and documents they upload to the platform. By uploading data or documents, the user grants Arkoura a limited, non-exclusive, royalty-free license to process, store, and transmit such content solely for the purpose of providing the service.</p>
      </>
    ),
  },
  {
    number: 14,
    title: 'Changes to These Terms',
    content: (
      <>
        <p>Arkoura reserves the right to modify these Terms and Conditions at any time.</p>
        <p>Material changes will be communicated to users via email notification or in-app notification at least <strong>30 days before the changes take effect</strong>.</p>
        <p>Continued use of the service after updated Terms take effect constitutes acceptance of the revised Terms. If you do not agree to the updated Terms, you must discontinue use of the service before the effective date of the changes.</p>
      </>
    ),
  },
  {
    number: 15,
    title: 'Governing Law and Dispute Resolution',
    content: (
      <>
        <p>These Terms and Conditions are governed by and construed in accordance with the laws of the <strong>Republic of Costa Rica</strong>, without regard to its conflict of laws provisions.</p>
        <p>Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of <strong>San José, Costa Rica</strong>, unless mandatory consumer protection law in the user&apos;s jurisdiction of residence requires otherwise.</p>
        <p><strong>EU Consumers.</strong> Users resident in the European Union retain the right to bring proceedings before the courts of their country of residence, as provided under applicable EU consumer protection law.</p>
      </>
    ),
  },
  {
    number: 16,
    title: 'Contact',
    content: (
      <>
        <p>For any questions, concerns, or requests related to these Terms and Conditions or your use of Arkoura, please contact us at:</p>
        <table className="w-full text-sm border-collapse mt-3">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6 font-medium text-gray-600 w-40">Legal inquiries</td>
              <td className="py-2 text-[#4A7A50]">legal@arkoura.com</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 pr-6 font-medium text-gray-600">Privacy and data rights</td>
              <td className="py-2 text-[#4A7A50]">privacy@arkoura.com</td>
            </tr>
            <tr>
              <td className="py-2 pr-6 font-medium text-gray-600">General support</td>
              <td className="py-2 text-[#4A7A50]">support@arkoura.com</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3"><strong>Operator:</strong> Arkoura</p>
      </>
    ),
  },
]

export default function TermsPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-[800px] mx-auto px-6 py-12">

        {/* Top bar */}
        <div className="flex items-start justify-between mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="Arkoura" className="w-9 h-9" />
          </Link>
          <LanguagePicker />
        </div>

        {/* Title */}
        <h1 className="font-[var(--font-manrope)] text-3xl font-bold text-[#1C2B1E] mb-2 tracking-tight">
          {t('terms.title', lang)}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Effective date: April 3, 2026 &nbsp;·&nbsp; Last revised: April 3, 2026
        </p>

        {/* Draft notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-10 text-amber-800 text-sm">
          <span className="text-base leading-5">⚠️</span>
          <span>{t('terms.draftNotice', lang)}</span>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.number}>
              <h2 className="font-[var(--font-manrope)] text-base font-bold text-[#1C2B1E] uppercase tracking-wider mb-3 pb-2 border-b border-[#E8EEE6]">
                {section.number}. {section.title}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_strong]:font-semibold [&_strong]:text-[#1C2B1E]">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-[#E8EEE6] text-center text-xs text-gray-400">
          © 2026 Arkoura · Ronald Granados Artavia · San José, Costa Rica
        </footer>

      </div>
    </div>
  )
}
