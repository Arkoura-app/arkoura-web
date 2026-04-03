'use client'

export const runtime = 'edge'

import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { LanguagePicker } from '@/components/auth/LanguagePicker'

const TERMS_SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Introduction and Acceptance',
    paragraphs: [
      'The Arkoura application is operated by Arkoura.',
      'By registering for or using the Arkoura application, you agree to be bound by these Terms and Conditions in their entirety. These Terms constitute a legally binding agreement between you and Arkoura. If you do not accept these Terms in full, you must not register for or use the service.',
      'These Terms are effective as of April 3, 2026.',
    ],
  },
  {
    title: '2. What Arkoura Is — and Is Not',
    paragraphs: [
      'Arkoura is a personal health journal and emergency communication platform designed to help individuals record and share health information in personal and emergency contexts.',
      'Arkoura is NOT a medical device under U.S. FDA regulations, CE marking requirements, the EU Medical Device Regulation (MDR), or any equivalent national medical device regulatory framework.',
      'Arkoura is NOT a medical record system, Electronic Health Record (EHR) system, or clinical record platform.',
      'Arkoura is NOT a healthcare provider, medical practice, pharmacy, or clinical laboratory.',
      'Arkoura does NOT provide medical diagnosis, clinical assessment, treatment recommendations, or medical advice of any kind.',
      'All information stored in Arkoura represents the profile holder\'s personal recollection of health events and experiences — not clinically verified, authenticated, or validated data.',
      'Arkoura does not replace consultation with a qualified healthcare professional. Users should always seek the advice of a licensed medical professional regarding any medical condition or health concern.',
      'IN A MEDICAL EMERGENCY, immediately contact your local emergency services (911, 112, or the equivalent number in your jurisdiction).',
    ],
  },
  {
    title: '3. User Accounts and Eligibility',
    paragraphs: [
      'Age Requirement: You must be at least 18 years of age, or the minimum age of legal majority in your jurisdiction, to register for and use Arkoura independently.',
      'Minors: Minors may have accounts created and managed on their behalf by a legal guardian through the Family Group Account feature, as described in Section 11.',
      'Account Security: You are solely responsible for maintaining the confidentiality of your account credentials, including your password and QR code. You are responsible for all activity that occurs under your account, whether or not authorized by you. You must notify Arkoura immediately of any unauthorized use of your account.',
    ],
  },
  {
    title: '4. Personal Health Journal — User Responsibilities',
    paragraphs: [
      'By entering information into your Arkoura health journal, you represent and acknowledge that all journal entries, health data, and uploaded documents reflect your genuine personal recollection of health events and experiences, to the best of your knowledge.',
      'Arkoura does not verify, validate, authenticate, or cross-reference any information or document you enter or upload.',
      'You are solely responsible for the accuracy and completeness of your health record. Arkoura is a journal tool — the quality of the information it contains depends entirely on you.',
      'Entering deliberately false, fabricated, or misleading health information that is subsequently shared with emergency responders, healthcare providers, or other third parties may constitute fraud, obstruction of emergency services, or other criminal or civil offenses under applicable law. The profile holder bears sole legal responsibility for any such conduct.',
    ],
  },
  {
    title: '5. Document Upload and Authenticity',
    paragraphs: [
      'Arkoura accepts document uploads — including PDFs, images, clinical letters, laboratory results, and prescriptions — as submitted, without any form of verification.',
      'Arkoura does not authenticate, validate, or verify the origin, accuracy, or integrity of any document uploaded by a user.',
      'By uploading a document to Arkoura, the profile holder or caretaker represents and warrants that: (a) the document is genuine and has not been falsified, altered, fabricated, or tampered with in any manner; (b) they hold the legal right to upload and share the document; and (c) the document does not infringe upon the rights of any third party.',
      'Any AI-generated, falsified, altered, forged, or tampered document uploaded to Arkoura is the sole legal and financial responsibility of the profile holder or caretaker who uploaded it.',
      'Arkoura is not liable for the retransmission of falsified or inaccurate information to emergency contacts, healthcare providers, or emergency responders where such information originated from documents uploaded by a user.',
    ],
  },
  {
    title: '6. Emergency Access and QR Code',
    paragraphs: [
      'The Arkoura QR code emergency profile is designed to assist emergency responders by providing access to a user\'s self-reported health information.',
      'Arkoura does not guarantee that the QR code emergency profile will produce any specific emergency response or outcome.',
      'Arkoura does not guarantee that emergency contacts will receive, read, or act upon notifications sent through the platform.',
      'Arkoura does not guarantee the availability, accuracy, or timeliness of notifications transmitted via third-party services, including email, WhatsApp, or SMS.',
      'Helpers, emergency responders, and healthcare providers who access the emergency profile do so at their own professional or personal discretion. Arkoura is not responsible for any decisions made on the basis of information contained in the emergency profile.',
      'The emergency profile contains self-reported information only — it is not a substitute for a complete clinical assessment by a qualified healthcare professional.',
    ],
  },
  {
    title: '7. AI-Assisted Features and Limitations',
    paragraphs: [
      'Arkoura incorporates artificial intelligence to assist with journal entry creation, document data extraction, and conversational queries about journal content.',
      'AI responses are generated solely from information the profile holder has entered into their journal. They do not constitute medical advice, clinical assessment, or diagnosis.',
      'AI responses may contain errors, omissions, or inaccuracies. Users must not rely on AI-generated responses for any medical decision.',
      'The AI is explicitly scoped to the journal\'s contents — it does not access external medical databases, clinical guidelines, real-time health information, or any information outside the profile holder\'s own journal.',
      'Session transcripts are stored and accessible to the profile holder. They may be reviewed by Arkoura for quality assurance and safety improvement purposes.',
    ],
  },
  {
    title: '8. Appointment Mode and Helper Access',
    paragraphs: [
      'Arkoura\'s Appointment Mode enables a profile holder to grant a third party — such as a healthcare provider — limited, time-scoped access to their personal health journal via a one-time password (OTP) mechanism.',
      'Information accessed in Appointment Mode is patient self-reported and must not be treated as a verified clinical record or used as a substitute for professional clinical assessment.',
      'Healthcare providers accessing journal information via Appointment Mode acknowledge that the information presented has not been clinically verified. They must exercise independent professional judgment in all clinical decisions.',
      'Arkoura is not liable for any clinical decision made by a healthcare provider based on information accessed through Appointment Mode.',
      'The profile holder retains full control over Appointment Mode access through the OTP sharing mechanism.',
    ],
  },
  {
    title: '9. Data, Privacy, and Anonymized Use',
    paragraphs: [
      'Arkoura collects and processes personal health data as described in the Arkoura Privacy Policy, which is incorporated by reference into these Terms.',
      'By using Arkoura, you consent to Arkoura using fully anonymized and aggregated health data — from which all personally identifying information has been removed — for the following purposes: (a) improving Arkoura\'s AI models and product features; (b) identifying trends in health conditions, symptoms, and medication usage patterns to support medical research; (c) contributing anonymized insights to public health initiatives and academic research; and (d) improving emergency response protocols.',
      'No data that could identify an individual is shared externally as part of these activities.',
      'Users may opt out of the use of their anonymized data for research purposes by submitting a written request to support@arkoura.com. Opting out does not affect the user\'s ability to access or use the service.',
      'Data retention, deletion, and portability rights are described in the Privacy Policy.',
    ],
  },
  {
    title: '10. Regulatory Jurisdiction Notes',
    paragraphs: [
      'GDPR (European Union / EEA): Arkoura processes personal data as a data controller under GDPR Article 4. Legal basis: user consent (Article 6(1)(a)) and, for health data, explicit consent (Article 9(2)(a)). EU/EEA users have rights of access, rectification, erasure, restriction, portability, and objection. Data Protection Officer: privacy@arkoura.com.',
      'HIPAA (United States): Arkoura is not a HIPAA covered entity and is not a business associate of any covered entity. Arkoura does not create, receive, maintain, or transmit Protected Health Information (PHI) as defined under HIPAA. US users are advised that information entered into Arkoura is not protected under HIPAA.',
      'CCPA (California, United States): California residents have the right to know, delete, and opt out of the sale of personal information. Arkoura does not sell personal information. California residents may submit requests to privacy@arkoura.com.',
      'LGPD (Brazil): Brazilian users\' data is processed in accordance with Lei Geral de Proteção de Dados (LGPD), Law 13,709/2018. Legal basis: user consent and legitimate interest for service provision. Data Subject rights under LGPD apply.',
      'PDPL (Costa Rica — Law 8968): Arkoura complies with the Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Law 8968). Users have rights of access, rectification, and cancellation under Costa Rican law. Regulatory authority: PRODHAB (Agencia de Protección de Datos de los Habitantes).',
    ],
  },
  {
    title: '11. Family Group Accounts',
    paragraphs: [
      'Arkoura\'s Family Group Account feature allows a master account holder to create and manage sub-accounts on behalf of other individuals.',
      'Master account holders are responsible for ensuring that health data entered for sub-account holders is accurate and current.',
      'Master account holders must have the legal authority to manage health information on behalf of the sub-account holder — including, as applicable, parental authority, legal guardianship, or power of attorney.',
      'Sub-account holders retain sovereignty over their own account and may dissolve the relationship with the master account at any time.',
    ],
  },
  {
    title: '12. Limitation of Liability',
    paragraphs: [
      'Arkoura is provided "as is" without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      'To the maximum extent permitted by applicable law, Arkoura and its operator shall not be liable for: (a) any medical outcome resulting from information shared via the platform; (b) failure of emergency notifications to reach their intended recipients; (c) any decision made by a helper, healthcare provider, or emergency responder based on information accessed through the platform; (d) errors, omissions, or inaccuracies in AI-generated responses; (e) unauthorized access to a user\'s account resulting from the user\'s failure to protect their credentials, QR code, or OTP.',
      'Cap on Liability: Arkoura\'s total aggregate liability to any user shall not exceed the total amount paid by the user to Arkoura in the twelve (12) months immediately preceding the event giving rise to the claim.',
      'Nothing in this Section limits liability that cannot be excluded under applicable mandatory law.',
    ],
  },
  {
    title: '13. Intellectual Property',
    paragraphs: [
      'The Arkoura application, including its content, features, user interface design, and underlying technology, is owned by Arkoura and is protected by applicable intellectual property laws, including copyright, trademark, and trade secret law.',
      'Users retain full ownership of all health data and documents they upload to the platform. By uploading data or documents, the user grants Arkoura a limited, non-exclusive, royalty-free license to process, store, and transmit such content solely for the purpose of providing the service.',
    ],
  },
  {
    title: '14. Changes to These Terms',
    paragraphs: [
      'Arkoura reserves the right to modify these Terms and Conditions at any time.',
      'Material changes will be communicated to users via email notification or in-app notification at least 30 days before the changes take effect.',
      'Continued use of the service after updated Terms take effect constitutes acceptance of the revised Terms. If you do not agree to the updated Terms, you must discontinue use of the service before the effective date of the changes.',
    ],
  },
  {
    title: '15. Governing Law and Dispute Resolution',
    paragraphs: [
      'These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Costa Rica, without regard to its conflict of laws provisions.',
      'Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of San José, Costa Rica, unless mandatory consumer protection law in the user\'s jurisdiction of residence requires otherwise.',
      'EU Consumers: Users resident in the European Union retain the right to bring proceedings before the courts of their country of residence, as provided under applicable EU consumer protection law.',
    ],
  },
  {
    title: '16. Contact',
    paragraphs: [
      'Legal inquiries: legal@arkoura.com',
      'Privacy and data rights: privacy@arkoura.com',
      'General support: support@arkoura.com',
      'Operator: Arkoura',
    ],
  },
]

export default function TermsPage() {
  const { lang } = useLang()

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#4A7A50]">
          Arkoura
        </Link>
        <LanguagePicker />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h1 className="text-3xl font-bold text-[#1C2B1E] mb-2">
          {t('terms.title', lang)}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Effective date: April 3, 2026 · Last revised: April 3, 2026
        </p>

        {/* Sections */}
        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          {TERMS_SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="text-base font-bold text-[#1C2B1E] mb-3">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#F0F4EE] text-xs text-gray-400 text-center">
          © 2026 Arkoura · San José, Costa Rica
        </div>
      </div>
    </div>
  )
}
