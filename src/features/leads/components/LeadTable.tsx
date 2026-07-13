import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { LeadStatusBadge } from './LeadStatusBadge'
import type { Lead } from '../types/lead.types'

type LeadTableProps = {
  leads: Lead[] | undefined
  isLoading: boolean
  isError: boolean
}

export function LeadTable({ leads, isLoading, isError }: LeadTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={leads}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun lead pour le moment."
      errorLabel="Impossible de charger les leads."
    >
      {(data) => <LeadTableContent leads={data} onRowClick={(lead) => navigate(`/leads/${lead.id}`)} />}
    </QueryState>
  )
}

function LeadTableContent({ leads, onRowClick }: { leads: Lead[]; onRowClick: (lead: Lead) => void }) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: leads,
    searchableFields: ['prenom', 'nom', 'courriel', 'telephone', 'numero'],
  })

  const columns: TableColumn<Lead>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (lead) => lead.numero },
    {
      key: 'nom',
      header: 'Nom',
      sortable: true,
      primary: true,
      render: (lead) => <span className="font-medium text-reca-black">{`${lead.prenom} ${lead.nom}`}</span>,
    },
    { key: 'telephone', header: 'Téléphone', render: (lead) => lead.telephone ?? '—' },
    { key: 'typeService', header: 'Service', render: (lead) => lead.typeService ?? '—' },
    { key: 'statut', header: 'Statut', primary: true, render: (lead) => <LeadStatusBadge status={lead.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, courriel, téléphone..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(lead) => lead.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
