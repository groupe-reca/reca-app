import { Modal } from '@/components/ui/Modal'
import { useUpdateInvoice } from '../hooks/useUpdateInvoice'
import { InvoiceForm } from './InvoiceForm'
import type { Invoice } from '../types/invoice.types'

type InvoiceFormModalProps = {
  open: boolean
  onClose: () => void
  invoice: Invoice
}

export function InvoiceFormModal({ open, onClose, invoice }: InvoiceFormModalProps) {
  const updateInvoice = useUpdateInvoice(invoice.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier la facture">
      <InvoiceForm
        invoice={invoice}
        isSubmitting={updateInvoice.isPending}
        onSubmit={(values) => updateInvoice.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
