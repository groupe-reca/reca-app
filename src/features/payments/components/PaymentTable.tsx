import { Search } from 'lucide-react'
import { Link } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { formatCurrency } from '@/lib/format'
import type { Payment } from '../types/payment.types'

type PaymentTableProps = {
  payments: Payment[] | undefined
  isLoading: boolean
  isError: boolean
}

export function PaymentTable({ payments, isLoading, isError }: PaymentTableProps) {
  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={payments}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun paiement pour le moment."
      errorLabel="Impossible de charger les paiements."
    >
      {(data) => <PaymentTableContent payments={data} />}
    </QueryState>
  )
}

function PaymentTableContent({ payments }: { payments: Payment[] }) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: payments,
    searchableFields: ['methode', 'reference'],
  })

  const columns: TableColumn<Payment>[] = [
    { key: 'date', header: 'Date', sortable: true, render: (payment) => payment.date },
    {
      key: 'invoice',
      header: 'Facture',
      render: (payment) =>
        payment.invoice ? (
          <Link to={`/invoices/${payment.invoice.id}`} className="text-reca-red hover:underline">
            {payment.invoice.numero}
          </Link>
        ) : (
          '—'
        ),
    },
    { key: 'montant', header: 'Montant', render: (payment) => formatCurrency(payment.montant) },
    { key: 'methode', header: 'Méthode', render: (payment) => payment.methode ?? '—' },
    { key: 'reference', header: 'Référence', render: (payment) => payment.reference ?? '—' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Méthode, référence..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table columns={columns} rows={rows} rowKey={(payment) => payment.id} sort={sort} onSortChange={toggleSort} />
    </div>
  )
}
