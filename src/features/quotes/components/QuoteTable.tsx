import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { formatCurrency } from '@/lib/format'
import { QuoteStatusBadge } from './QuoteStatusBadge'
import type { Quote } from '../types/quote.types'

type QuoteTableProps = {
  quotes: Quote[] | undefined
  isLoading: boolean
  isError: boolean
}

export function QuoteTable({ quotes, isLoading, isError }: QuoteTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={quotes}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune soumission pour le moment."
      errorLabel="Impossible de charger les soumissions."
    >
      {(data) => <QuoteTableContent quotes={data} onRowClick={(quote) => navigate(`/quotes/${quote.id}`)} />}
    </QueryState>
  )
}

function QuoteTableContent({ quotes, onRowClick }: { quotes: Quote[]; onRowClick: (quote: Quote) => void }) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: quotes,
    searchableFields: ['numero'],
  })

  const columns: TableColumn<Quote>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (quote) => quote.numero },
    {
      key: 'lead',
      header: 'Lead',
      render: (quote) => (quote.lead ? `${quote.lead.prenom} ${quote.lead.nom}` : '—'),
    },
    { key: 'total', header: 'Total', sortable: true, render: (quote) => formatCurrency(quote.total) },
    { key: 'statut', header: 'Statut', render: (quote) => <QuoteStatusBadge status={quote.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(quote) => quote.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
