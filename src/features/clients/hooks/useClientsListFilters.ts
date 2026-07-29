import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Client, ClientStatus } from '../types/client.types'

export type ClientStatusFilter = 'tous' | ClientStatus

export const CLIENT_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'inactif', label: 'Inactifs' },
]

/** Recherche + filtre par statut de la page liste Clients — état purement local, pas de nouvel appel réseau. */
export function useClientsListFilters(clients: Client[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!clients) return []
    const term = search.trim().toLowerCase()

    return clients.filter((client) => {
      if (statusFilter !== 'tous' && client.statut !== statusFilter) return false
      if (!term) return true
      const haystack = [
        client.numero,
        `${client.prenom} ${client.nom}`,
        client.entreprise ?? '',
        client.courriel ?? '',
        client.telephone ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [clients, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
