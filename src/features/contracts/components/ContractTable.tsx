import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { formatCurrency } from '@/lib/format'
import { ContractStatusBadge } from './ContractStatusBadge'
import type { Contract } from '../types/contract.types'

type ContractTableProps = {
  contracts: Contract[] | undefined
  isLoading: boolean
  isError: boolean
}

export function ContractTable({ contracts, isLoading, isError }: ContractTableProps) {
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
        <ContractTableContent
          contracts={data}
          onRowClick={(contract) => navigate(`/contracts/${contract.id}`)}
        />
      )}
    </QueryState>
  )
}

function ContractTableContent({
  contracts,
  onRowClick,
}: {
  contracts: Contract[]
  onRowClick: (contract: Contract) => void
}) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: contracts,
    searchableFields: ['numero', 'type', 'saison'],
  })

  const columns: TableColumn<Contract>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (contract) => contract.numero },
    {
      key: 'client',
      header: 'Client',
      render: (contract) =>
        contract.client ? `${contract.client.prenom} ${contract.client.nom}` : '—',
    },
    { key: 'type', header: 'Type', render: (contract) => contract.type ?? '—' },
    { key: 'saison', header: 'Saison', render: (contract) => contract.saison ?? '—' },
    { key: 'prix', header: 'Prix', render: (contract) => (contract.prix != null ? formatCurrency(contract.prix) : '—') },
    { key: 'statut', header: 'Statut', render: (contract) => <ContractStatusBadge status={contract.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, type, saison..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(contract) => contract.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
