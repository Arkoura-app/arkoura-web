'use client'

import { useState, useCallback } from 'react'
import { CF_FUNCTIONS_BASE } from '@/lib/constants'

interface CatalogEntry {
  id: string
  names: Record<string, string>
  allergenType?: string
  drugClass?: string
  isCritical?: boolean
  route?: string
  genericNames?: string
}

export function useCatalogSearch(type: 'allergen' | 'medication') {
  const [results, setResults] = useState<CatalogEntry[]>([])
  const [searching, setSearching] = useState(false)

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(
        `${CF_FUNCTIONS_BASE}/getCatalog?type=${type}&q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setResults(data.entries ?? [])
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [type])

  return { results, searching, search, setResults }
}
