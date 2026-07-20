import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { ContractCard } from './ContractCard'
import { ContractsStatsRow } from './ContractsStatsRow'
import {
  CONTRACT_STATUS_FILTER_OPTIONS,
  useContractsListFilters,
} from '../hooks/useContractsListFilters'
import type { ContractStatusFilter } from '../hooks/useContractsListFilters'
import type { Contract } from '../types/contract.types'

type ContractsListContentProps = {
  contracts: Contract[] | undefined
  isLoading: boolean
  isError: boolean
}

export function ContractsListContent({ contracts, isLoading, isError }: ContractsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={contracts}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun contrat pour le moment."
      errorLabel="Impossible de charger les contrats."
    >
      {(data) => (
        <ContractsListBody contracts={data} onSelect={(contract) => navigate(`/contracts/${contract.id}`)} />
      )}
    </QueryState>
  )
}

function ContractsListBody({
  contracts,
  onSelect,
}: {
  contracts: Contract[]
  onSelect: (contract: Contract) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useContractsListFilters(contracts)

  return (
    <div className="flex flex-col gap-4">
      <ContractsStatsRow contracts={contracts} />

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, client, adresse, téléphone…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={CONTRACT_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as ContractStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun contrat ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((contract) => (
            <ContractCard key={contract.id} contract={contract} onClick={() => onSelect(contract)} />
          ))}
        </div>
      )}
    </div>
  )
}
