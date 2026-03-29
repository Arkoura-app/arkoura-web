'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { ConditionsTab } from '@/components/health/ConditionsTab'
import { AllergiesTab } from '@/components/health/AllergiesTab'
import { MedicationsTab } from '@/components/health/MedicationsTab'
import { ContactsTab } from '@/components/health/ContactsTab'
import { PhysicianTab } from '@/components/health/PhysicianTab'

const TABS = [
  { value: 'conditions', label: 'Conditions' },
  { value: 'allergies', label: 'Allergies' },
  { value: 'medications', label: 'Medications' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'physician', label: 'Physician' },
]

const triggerCls = [
  'flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
  'text-gray-400 hover:text-[#1C2B1E]',
  'border-b-2 border-transparent -mb-px',
  'data-[state=active]:text-[#4A7A50] data-[state=active]:border-[#4A7A50]',
  'focus-visible:outline-none',
].join(' ')

export default function EmergencyDataPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-[var(--font-manrope)] text-2xl font-bold text-[#1C2B1E] tracking-tight">
          Emergency Data
        </h1>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
          This information is shown on your public emergency profile when someone scans your QR code
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
          <ConditionsTab />
        </Tabs.Content>

        <Tabs.Content value="allergies">
          <AllergiesTab />
        </Tabs.Content>

        <Tabs.Content value="medications">
          <MedicationsTab />
        </Tabs.Content>

        <Tabs.Content value="contacts">
          <ContactsTab />
        </Tabs.Content>

        <Tabs.Content value="physician">
          <PhysicianTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
