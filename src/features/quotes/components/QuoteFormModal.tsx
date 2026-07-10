import { Modal } from '@/components/ui/Modal'
import { useCreateQuote } from '../hooks/useCreateQuote'
import { useUpdateQuote } from '../hooks/useUpdateQuote'
import { QuoteForm } from './QuoteForm'
import type { QuoteFormValues } from '../schemas/quote.schema'
import type { Quote } from '../types/quote.types'

type QuoteFormModalProps = {
  open: boolean
  onClose: () => void
  quote?: Quote
  leadId?: string
  onCreated?: (quote: Quote) => void
}

export function QuoteFormModal({ open, onClose, quote, leadId, onCreated }: QuoteFormModalProps) {
  const createQuote = useCreateQuote(leadId)
  const updateQuote = useUpdateQuote(quote?.id ?? '')
  const isEditing = Boolean(quote)

  function handleSubmit(values: QuoteFormValues) {
    if (isEditing && quote) {
      updateQuote.mutate(values, { onSuccess: onClose })
    } else {
      createQuote.mutate(values, {
        onSuccess: (created) => {
          onClose()
          onCreated?.(created)
        },
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier la soumission' : 'Nouvelle soumission'}>
      <QuoteForm
        quote={quote}
        isSubmitting={isEditing ? updateQuote.isPending : createQuote.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
