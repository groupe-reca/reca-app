import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuoteFormModal } from '../components/QuoteFormModal'
import { QuoteTable } from '../components/QuoteTable'
import { useQuotes } from '../hooks/useQuotes'

export function QuotesListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: quotes, isLoading, isError } = useQuotes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Soumissions</h1>
          <p className="text-body text-reca-gray-medium">Soumissions envoyées aux prospects et clients.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle soumission
        </Button>
      </div>

      <QuoteTable quotes={quotes} isLoading={isLoading} isError={isError} />

      <QuoteFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
