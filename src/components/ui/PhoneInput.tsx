'use client'

import { useState, useRef, useEffect } from 'react'
import { COUNTRY_CODES } from '@/lib/countryCodes'
import type { CountryCode } from '@/lib/countryCodes'

interface Props {
  value: string
  onChange: (fullNumber: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PhoneInput({ value, onChange, placeholder, disabled, className }: Props) {
  function parsePhone(full: string): { code: string; local: string } {
    if (!full) return { code: "+506", local: "" }
    const match = COUNTRY_CODES
      .slice()
      .sort((a, b) => b.code.length - a.code.length)
      .find(c => full.startsWith(c.code))
    if (match) {
      return { code: match.code, local: full.slice(match.code.length) }
    }
    return { code: "+506", local: full }
  }

  const parsed = parsePhone(value)
  const [selectedCode, setSelectedCode] = useState(parsed.code)
  const [localNumber, setLocalNumber] = useState(parsed.local)
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!value) return
    const reparsed = parsePhone(value)
    if (reparsed.code !== selectedCode || reparsed.local !== localNumber) {
      setSelectedCode(reparsed.code)
      setLocalNumber(reparsed.local)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSelect(country: CountryCode) {
    setSelectedCode(country.code)
    setOpen(false)
    setSearchQuery("")
    onChange(`${country.code}${localNumber}`)
  }

  function handleLocalChange(val: string) {
    const clean = val.replace(/\D/g, "")
    setLocalNumber(clean)
    onChange(`${selectedCode}${clean}`)
  }

  const filtered = searchQuery
    ? COUNTRY_CODES.filter(c =>
        c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery) ||
        c.iso.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COUNTRY_CODES

  const selectedCountry = COUNTRY_CODES.find(c => c.code === selectedCode)

  return (
    <div
      className={`flex rounded-xl border border-gray-200 overflow-visible focus-within:border-[#4A7A50] focus-within:ring-1 focus-within:ring-[#4A7A50]/20 ${className ?? ""}`}
      ref={dropdownRef}
    >
      <div className="relative flex-shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen(!open)
            setSearchQuery("")
          }}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 rounded-l-xl h-full"
          style={{ minWidth: "88px" }}
        >
          <span>{selectedCountry?.flag}</span>
          <span className="font-medium">{selectedCode}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            style={{ width: "280px" }}
          >
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#4A7A50]"
              />
            </div>
            <div className="overflow-y-auto max-h-52">
              {filtered.length === 0 ? (
                <p className="text-xs text-gray-400 px-3 py-3 text-center">No results</p>
              ) : (
                filtered.map(c => (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[#F4FAF4] transition-colors ${
                      c.code === selectedCode ? "bg-[#E8F2E6] text-[#4A7A50]" : "text-gray-700"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 truncate">{c.country}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{c.code}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        inputMode="numeric"
        value={localNumber}
        onChange={e => handleLocalChange(e.target.value)}
        placeholder={placeholder ?? "88887777"}
        maxLength={15}
        disabled={disabled}
        className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none rounded-r-xl disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  )
}
