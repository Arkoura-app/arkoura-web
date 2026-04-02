'use client'

import { useState, useEffect } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { ConditionsTab } from '@/components/health/ConditionsTab'
import { AllergiesTab } from '@/components/health/AllergiesTab'
import { MedicationsTab } from '@/components/health/MedicationsTab'
import { ContactsTab } from '@/components/health/ContactsTab'
import { PhysicianTab } from '@/components/health/PhysicianTab'
import { useLang } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'
import { useAuth } from '@/hooks/useAuth'
import { cfFetch } from '@/lib/api'
import type { Condition } from '@/components/health/ConditionsTab'
import type { Allergy } from '@/components/health/AllergiesTab'
import type { Medication } from '@/components/health/MedicationsTab'
import type { EmergencyContact } from '@/components/health/ContactsTab'
import type { PrimaryPhysician } from '@/components/health/PhysicianTab'

const triggerCls = [
  'flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
  'text-gray-400 hover:text-[#1C2B1E]',
  'border-b-2 border-transparent -mb-px',
  'data-[state=active]:text-[#4A7A50] data-[state=active]:border-[#4A7A50]',
  'focus-visible:outline-none',
].join(' ')

export default function EmergencyDataPage() {
  const { lang } = useLang()
  const { user } = useAuth()
  const [allData, setAllData] = useState<{
    conditions: Condition[]
    allergies: Allergy[]
    medications: Medication[]
    contacts: EmergencyContact[]
    physician: PrimaryPhysician | null
  } | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function fetchAll() {
      setDataLoading(true)
      try {
        const [condRes, algRes, medRes, conRes, phyRes] = await Promise.all([
          cfFetch('getConditions'),
          cfFetch('getAllergies'),
          cfFetch('getMedications'),
          cfFetch('getEmergencyContacts'),
          cfFetch('getPrimaryPhysician'),
        ])

        const [condData, algData, medData, conData, phyData] = await Promise.all([
          condRes.json(),
          algRes.json(),
          medRes.json(),
          conRes.json(),
          phyRes.json(),
        ])

        setAllData({
          conditions: condData.conditions ?? [],
          allergies: algData.allergies ?? [],
          medications: medData.medications ?? [],
          contacts: conData.emergencyContacts ?? [],
          physician: phyData.physician ?? null,
        })
      } catch (err) {
        console.error('Emergency data fetch error:', err)
      } finally {
        setDataLoading(false)
      }
    }

    void fetchAll()
  }, [user])

  const TABS = [
    { value: 'conditions', label: t('emergency.conditions', lang) },
    { value: 'allergies', label: t('emergency.allergies', lang) },
    { value: 'medications', label: t('emergency.medications', lang) },
    { value: 'contacts', label: t('emergency.contacts', lang) },
    { value: 'physician', label: t('emergency.physician', lang) },
  ]

  if (dataLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 animate-pulse"
              style={{ boxShadow: '0 1px 3px rgba(28,43,30,0.06)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-24 h-4 bg-gray-100 rounded-full" />
                <div className="w-16 h-4 bg-gray-50 rounded-full" />
              </div>
              <div className="w-full h-3 bg-gray-50 rounded-full mb-2" />
              <div className="w-2/3 h-3 bg-gray-50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] tracking-tight">
          {t('emergency.title', lang)}
        </h1>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
          {t('emergency.subtitle', lang)}
        </p>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="conditions">
        <div className="border-b border-gray-200 mb-5">
          <Tabs.List
            className="flex overflow-x-auto"
            aria-label="Emergency data sections"
          >
            {TABS.map((tab) => (
              <Tabs.Trigger key={tab.value} value={tab.value} className={triggerCls}>
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>

        <Tabs.Content value="conditions">
          <ConditionsTab initialData={allData?.conditions} />
        </Tabs.Content>

        <Tabs.Content value="allergies">
          <AllergiesTab initialData={allData?.allergies} />
        </Tabs.Content>

        <Tabs.Content value="medications">
          <MedicationsTab initialData={allData?.medications} />
        </Tabs.Content>

        <Tabs.Content value="contacts">
          <ContactsTab initialData={allData?.contacts} />
        </Tabs.Content>

        <Tabs.Content value="physician">
          <PhysicianTab initialData={allData?.physician} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
