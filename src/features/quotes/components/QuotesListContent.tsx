import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { QuoteCard } from './QuoteCard'
import { QuotesStatsRow } from './QuotesStatsRow'
import { QUOTE_STATUS_FILTER_OPTIONS, useQuotesListFilters } from '../hooks/useQuotesListFilters'
import type { QuoteStatusFilter } from '../hooks/useQuotesListFilters'
import type { Quote } from '../types/quote.types'

type QuotesListContentProps = {
  quotes: Quote[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function QuotesListContent({ quotes, isLoading, isError, showStats = true }: QuotesListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={quotes}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune soumission pour le moment."
      errorLabel="Impossible de charger les soumissions."
    >
      {(data) => (
        <QuotesListBody
          quotes={data}
          showStats={showStats}
          onSelect={(quote) => navigate(`/quotes/${quote.id}`)}
        />
      )}
    </QueryState>
  )
}

function QuotesListBody({
  quotes,
  showStats,
  onSelect,
}: {
  quotes: Quote[]
  showStats: boolean
  onSelect: (quote: Quote) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useQuotesListFilters(quotes)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <QuotesStatsRow quotes={quotes} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, lead…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={QUOTE_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as QuoteStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucune soumission ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} onClick={() => onSelect(quote)} />
          ))}
        </div>
      )}
    </div>
  )
}
