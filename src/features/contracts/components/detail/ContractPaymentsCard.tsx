import { Link } from 'react-router'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import type { Invoice } from '@/features/invoices/types/invoice.types'
import type { Payment } from '@/features/payments/types/payment.types'
import { formatCurrency, formatDateLong } from '@/lib/format'
import type { Contract } from '../../types/contract.types'

type ContractPaymentsCardProps = {
  contract: Contract
  invoices: Invoice[]
  payments: Payment[]
}

/** "Paiements" — tableau des versements directement en ligne (plus de modale, `ContractPaymentsHistoryModal` supprimée). */
export function ContractPaymentsCard({ invoices, payments }: ContractPaymentsCardProps) {
  const total = invoices.reduce((sum, invoice) => sum + invoice.total, 0)

  function lastPaidDate(invoiceId: string): string | null {
    const matches = payments.filter((payment) => payment.factureId === invoiceId)
    if (matches.length === 0) return null
    return [...matches].sort((a, b) => b.date.localeCompare(a.date))[0].date
  }

  const columns: TableColumn<Invoice>[] = [
    { key: 'numero', header: 'Versement', primary: true, render: (invoice) => invoice.numero },
    { key: 'total', header: 'Montant', render: (invoice) => formatCurrency(invoice.total) },
    { key: 'date', header: 'Échéance', render: (invoice) => formatDateLong(invoice.date) },
    { key: 'statut', header: 'Statut', render: (invoice) => <InvoiceStatusBadge status={invoice.statut} /> },
    {
      key: 'paidAt',
      header: 'Payé le',
      render: (invoice) => {
        const date = lastPaidDate(invoice.id)
        return date ? formatDateLong(date) : '—'
      },
    },
    {
      key: 'action',
      header: 'Action',
      render: (invoice) => (
        <Link to={`/invoices/${invoice.id}`} className="text-reca-red hover:underline">
          Voir la facture
        </Link>
      ),
    },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Paiements</h2>

      {invoices.length > 0 ? (
        <>
          <Table columns={columns} rows={invoices} rowKey={(invoice) => invoice.id} />
          <div className="flex items-center justify-between border-t border-reca-gray-light pt-4 text-body">
            <span className="font-medium text-reca-black">Total</span>
            <span className="font-medium text-reca-black">{formatCurrency(total)}</span>
          </div>
        </>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun versement pour ce contrat.</p>
      )}
    </Card>
  )
}
