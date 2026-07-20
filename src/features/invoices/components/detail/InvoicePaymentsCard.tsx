import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { PaymentFormModal } from '@/features/payments/components/PaymentFormModal'
import { useDeletePayment } from '@/features/payments/hooks/useDeletePayment'
import { useInvoicePayments } from '@/features/payments/hooks/useInvoicePayments'
import type { Payment } from '@/features/payments/types/payment.types'
import { formatCurrency, formatDateLong } from '@/lib/format'

/** Même gabarit que `ContractPaymentsCard.tsx` — tableau inline, plus de liste `<div>` brute. */
export function InvoicePaymentsCard({ invoiceId }: { invoiceId: string }) {
  const { data: payments } = useInvoicePayments(invoiceId)
  const deletePayment = useDeletePayment(invoiceId)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  function handleDelete(paymentId: string) {
    if (!window.confirm('Supprimer ce paiement ?')) return
    deletePayment.mutate(paymentId)
  }

  const columns: TableColumn<Payment>[] = [
    { key: 'date', header: 'Date', primary: true, render: (payment) => formatDateLong(payment.date) },
    { key: 'montant', header: 'Montant', render: (payment) => formatCurrency(payment.montant) },
    { key: 'methode', header: 'Méthode', render: (payment) => payment.methode || '—' },
    { key: 'reference', header: 'Référence', render: (payment) => payment.reference || '—' },
    {
      key: 'action',
      header: 'Action',
      render: (payment) => (
        <button
          type="button"
          onClick={() => handleDelete(payment.id)}
          aria-label="Supprimer le paiement"
          className="text-reca-gray-medium hover:text-red-600"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      ),
    },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-subtitle font-semibold text-reca-black">Paiements</h2>
        <Button variant="secondary" onClick={() => setPaymentModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Enregistrer un paiement
        </Button>
      </div>

      {payments && payments.length > 0 ? (
        <Table columns={columns} rows={payments} rowKey={(payment) => payment.id} />
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun paiement enregistré.</p>
      )}

      <PaymentFormModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} factureId={invoiceId} />
    </Card>
  )
}
