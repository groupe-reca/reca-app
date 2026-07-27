import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Quote, QuoteStatus } from '../types/quote.types'

export type QuoteStatusFilter = 'tous' | QuoteStatus

export const QUOTE_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'brouillon', label: 'Brouillons' },
  { id: 'envoyee', label: 'Envoyées' },
  { id: 'acceptee', label: 'Acceptées' },
  { id: 'refusee', label: 'Refusées' },
  { id: 'expiree', label: 'Expirées' },
]

/** Recherche + filtre par statut de la page liste Quotes — état purement local, pas de nouvel appel réseau. */
export function useQuotesListFilters(quotes: Quote[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!quotes) return []
    const term = search.trim().toLowerCase()

    return quotes.filter((quote) => {
      if (statusFilter !== 'tous' && quote.statut !== statusFilter) return false
      if (!term) return true
      const haystack = [
        quote.numero,
        quote.lead ? `${quote.lead.prenom} ${quote.lead.nom}` : '',
        quote.client ? `${quote.client.prenom} ${quote.client.nom}` : '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [quotes, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
