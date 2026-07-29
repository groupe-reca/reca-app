import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuotesListContent } from '../../components/QuotesListContent'
import { useQuotes } from '../../hooks/useQuotes'

export function DesktopQuotesListPage() {
  const navigate = useNavigate()
  const { data: quotes, isLoading, isError } = useQuotes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Soumissions</h1>
          <p className="text-body text-reca-gray-medium">Soumissions envoyées aux prospects et clients.</p>
        </div>
        <Button onClick={() => navigate('/quotes/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle soumission
        </Button>
      </div>

      <QuotesListContent quotes={quotes} isLoading={isLoading} isError={isError} />
    </div>
  )
}
