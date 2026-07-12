import { Modal } from '@/components/ui/Modal'
import { useUpdateQuote } from '../hooks/useUpdateQuote'
import { QuoteForm } from './QuoteForm'
import type { Quote } from '../types/quote.types'

type QuoteFormModalProps = {
  open: boolean
  onClose: () => void
  quote: Quote
}

export function QuoteFormModal({ open, onClose, quote }: QuoteFormModalProps) {
  const updateQuote = useUpdateQuote(quote.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier la soumission">
      <QuoteForm
        quote={quote}
        isSubmitting={updateQuote.isPending}
        onSubmit={(values) => updateQuote.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
