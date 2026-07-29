import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Lead, LeadStatus } from '../types/lead.types'

export type LeadStatusFilter = 'tous' | LeadStatus

export const LEAD_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'nouveau', label: 'Nouveaux' },
  { id: 'contacte', label: 'Contactés' },
  { id: 'soumission_envoyee', label: 'Soumission envoyée' },
  { id: 'converti', label: 'Convertis' },
  { id: 'perdu', label: 'Perdus' },
]

/** Recherche + filtre par statut de la page liste Leads — état purement local, pas de nouvel appel réseau. */
export function useLeadsListFilters(leads: Lead[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!leads) return []
    const term = search.trim().toLowerCase()

    return leads.filter((lead) => {
      if (statusFilter !== 'tous' && lead.statut !== statusFilter) return false
      if (!term) return true
      const haystack = [lead.numero, `${lead.prenom} ${lead.nom}`, lead.telephone ?? '', lead.courriel ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [leads, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
