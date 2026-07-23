import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Contract, ContractStatus } from '../types/contract.types'

export type ContractStatusFilter = 'tous' | 'actif' | 'suspendu' | 'a_signer' | 'brouillon' | 'expire'

const STATUS_FILTER_TO_STATUS: Partial<Record<ContractStatusFilter, ContractStatus>> = {
  actif: 'actif',
  suspendu: 'suspendu',
  a_signer: 'a_signer',
  brouillon: 'brouillon',
  expire: 'expire',
}

export const CONTRACT_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'suspendu', label: 'Suspendus' },
  { id: 'a_signer', label: 'À signer' },
  { id: 'brouillon', label: 'Brouillons' },
  { id: 'expire', label: 'Expirés' },
]

/** Recherche + filtre par statut de la page liste Contrats — état purement local, pas de nouvel appel réseau. */
export function useContractsListFilters(contracts: Contract[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!contracts) return []
    const targetStatus = STATUS_FILTER_TO_STATUS[statusFilter]
    const term = search.trim().toLowerCase()

    return contracts.filter((contract) => {
      if (targetStatus && contract.statut !== targetStatus) return false
      if (!term) return true
      const haystack = [
        contract.numero,
        contract.client ? `${contract.client.prenom} ${contract.client.nom}` : '',
        contract.adresseGeocodee ?? '',
        contract.client?.telephone ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [contracts, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
