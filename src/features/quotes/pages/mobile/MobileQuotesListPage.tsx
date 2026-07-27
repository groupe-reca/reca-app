import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileQuoteLayout } from '../../components/mobile/MobileQuoteLayout'
import { QuotesListContent } from '../../components/QuotesListContent'
import { useQuotes } from '../../hooks/useQuotes'

export function MobileQuotesListPage() {
  const navigate = useNavigate()
  const { data: quotes, isLoading, isError } = useQuotes()

  return (
    <MobileQuoteLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/quotes/new')}
          aria-label="Nouvelle soumission"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <QuotesListContent quotes={quotes} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileQuoteLayout>
  )
}
