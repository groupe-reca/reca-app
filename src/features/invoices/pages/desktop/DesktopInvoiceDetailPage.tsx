import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { toast } from '@/stores/toastStore'
import { InvoiceFormModal } from '../../components/InvoiceFormModal'
import { InvoiceDetailHeader } from '../../components/detail/InvoiceDetailHeader'
import { InvoiceSummaryCard } from '../../components/detail/InvoiceSummaryCard'
import { InvoiceClientContractCard } from '../../components/detail/InvoiceClientContractCard'
import { InvoicePaymentsCard } from '../../components/detail/InvoicePaymentsCard'
import { useInvoice } from '../../hooks/useInvoice'
import { useDeleteInvoice } from '../../hooks/useDeleteInvoice'
import { useUpdateInvoiceStatus } from '../../hooks/useUpdateInvoiceStatus'

/** Même pattern que `DesktopContractDetailPage.tsx`/`DesktopClientDetailPage.tsx` — composants purs de `components/detail/`. */
export function DesktopInvoiceDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: invoice, isLoading, isError } = useInvoice(id)
  const updateStatus = useUpdateInvoiceStatus(id)
  const deleteInvoice = useDeleteInvoice()
  const [editOpen, setEditOpen] = useState(false)

  function handlePlaceholder() {
    toast.success('Cette fonctionnalité arrive au prochain sprint.')
  }

  function handleDelete() {
    if (!invoice) return
    if (!window.confirm(`Supprimer la facture ${invoice.numero} ?`)) return
    deleteInvoice.mutate(invoice.id, { onSuccess: () => navigate('/invoices') })
  }

  function handleCancelInvoice() {
    if (!invoice) return
    if (!window.confirm(`Annuler la facture ${invoice.numero} ?`)) return
    updateStatus.mutate('annulee')
  }

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={invoice}
      errorLabel="Impossible de charger cette facture."
    >
      {(invoiceData) => (
        <div className="flex flex-col gap-6">
          <InvoiceDetailHeader
            invoice={invoiceData}
            onEdit={() => setEditOpen(true)}
            onEmail={handlePlaceholder}
            onDownloadPdf={handlePlaceholder}
            onCancelInvoice={handleCancelInvoice}
            onChangeStatus={(status) => updateStatus.mutate(status)}
            onDelete={handleDelete}
            isCancelling={updateStatus.isPending}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InvoiceSummaryCard invoice={invoiceData} />
            <InvoiceClientContractCard client={invoiceData.client} contract={invoiceData.contract} />
          </div>
          <InvoicePaymentsCard invoiceId={invoiceData.id} />
          <InvoiceFormModal open={editOpen} onClose={() => setEditOpen(false)} invoice={invoiceData} />
        </div>
      )}
    </QueryState>
  )
}
