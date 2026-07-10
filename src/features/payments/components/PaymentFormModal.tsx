import { Modal } from '@/components/ui/Modal'
import { useCreatePayment } from '../hooks/useCreatePayment'
import { PaymentForm } from './PaymentForm'
import type { PaymentFormValues } from '../schemas/payment.schema'
import type { Payment } from '../types/payment.types'

type PaymentFormModalProps = {
  open: boolean
  onClose: () => void
  factureId: string
  onCreated?: (payment: Payment) => void
}

export function PaymentFormModal({ open, onClose, factureId, onCreated }: PaymentFormModalProps) {
  const createPayment = useCreatePayment(factureId)

  function handleSubmit(values: PaymentFormValues) {
    createPayment.mutate(values, {
      onSuccess: (created) => {
        onClose()
        onCreated?.(created)
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Nouveau paiement">
      <PaymentForm isSubmitting={createPayment.isPending} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  )
}
