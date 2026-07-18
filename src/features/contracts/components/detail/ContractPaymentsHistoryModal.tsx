import { Link } from 'react-router'
import { Modal } from '@/components/ui/Modal'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import type { Invoice } from '@/features/invoices/types/invoice.types'
import type { Payment } from '@/features/payments/types/payment.types'
import { formatCurrency, formatDateLong } from '@/lib/format'

type ContractPaymentsHistoryModalProps = {
  open: boolean
  onClose: () => void
  invoices: Invoice[]
  payments: Payment[]
}

/** "Versements" d'un contrat = ses factures (une par entrée `modalitesPaiement`), voir `generateInvoicesFromSchedule`. */
export function ContractPaymentsHistoryModal({ open, onClose, invoices, payments }: ContractPaymentsHistoryModalProps) {
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
    <Modal open={open} onClose={onClose} title="Historique des paiements">
      {invoices.length > 0 ? (
        <Table columns={columns} rows={invoices} rowKey={(invoice) => invoice.id} />
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun versement pour ce contrat.</p>
      )}
    </Modal>
  )
}
