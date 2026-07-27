import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { QuoteFormModal } from '../../components/QuoteFormModal'
import { QuoteDetailHeader } from '../../components/detail/QuoteDetailHeader'
import { QuoteInfoStrip } from '../../components/detail/QuoteInfoStrip'
import { QuoteLeadCard } from '../../components/detail/QuoteLeadCard'
import { QuoteClientCard } from '../../components/detail/QuoteClientCard'
import { useDeleteQuote } from '../../hooks/useDeleteQuote'
import { useQuote } from '../../hooks/useQuote'
import { useUpdateQuoteStatus } from '../../hooks/useUpdateQuoteStatus'

export function DesktopQuoteDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: quote, isLoading, isError } = useQuote(id)
  const updateStatus = useUpdateQuoteStatus(id)
  const deleteQuote = useDeleteQuote()
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    if (!quote) return
    if (!window.confirm(`Supprimer la soumission ${quote.numero} ?`)) return
    deleteQuote.mutate(quote.id, { onSuccess: () => navigate('/quotes') })
  }

  return (
    <QueryState isLoading={isLoading} isError={isError} data={quote} errorLabel="Impossible de charger cette soumission.">
      {(quoteData) => (
        <div className="flex flex-col gap-6">
          <QuoteDetailHeader
            quote={quoteData}
            onEdit={() => setEditOpen(true)}
            onChangeStatus={(status) => updateStatus.mutate(status)}
            onDelete={handleDelete}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <QuoteInfoStrip quote={quoteData} />
            <QuoteLeadCard quote={quoteData} />
            <QuoteClientCard quote={quoteData} />
          </div>
          <QuoteFormModal open={editOpen} onClose={() => setEditOpen(false)} quote={quoteData} />
        </div>
      )}
    </QueryState>
  )
}
