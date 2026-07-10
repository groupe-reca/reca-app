import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { formatCurrency } from '@/lib/format'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import type { Invoice } from '../types/invoice.types'

type InvoiceTableProps = {
  invoices: Invoice[] | undefined
  isLoading: boolean
  isError: boolean
}

export function InvoiceTable({ invoices, isLoading, isError }: InvoiceTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={invoices}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune facture pour le moment."
      errorLabel="Impossible de charger les factures."
    >
      {(data) => (
        <InvoiceTableContent invoices={data} onRowClick={(invoice) => navigate(`/invoices/${invoice.id}`)} />
      )}
    </QueryState>
  )
}

function InvoiceTableContent({
  invoices,
  onRowClick,
}: {
  invoices: Invoice[]
  onRowClick: (invoice: Invoice) => void
}) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: invoices,
    searchableFields: ['numero'],
  })

  const columns: TableColumn<Invoice>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (invoice) => invoice.numero },
    {
      key: 'client',
      header: 'Client',
      render: (invoice) => (invoice.client ? `${invoice.client.prenom} ${invoice.client.nom}` : '—'),
    },
    { key: 'date', header: 'Date', sortable: true, render: (invoice) => invoice.date },
    { key: 'total', header: 'Total', render: (invoice) => formatCurrency(invoice.total) },
    { key: 'solde', header: 'Solde', render: (invoice) => formatCurrency(invoice.solde) },
    { key: 'statut', header: 'Statut', render: (invoice) => <InvoiceStatusBadge status={invoice.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro de facture..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(invoice) => invoice.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
