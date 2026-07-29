import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { LeadCard } from './LeadCard'
import { LeadsStatsRow } from './LeadsStatsRow'
import { LEAD_STATUS_FILTER_OPTIONS, useLeadsListFilters } from '../hooks/useLeadsListFilters'
import type { LeadStatusFilter } from '../hooks/useLeadsListFilters'
import type { Lead } from '../types/lead.types'

type LeadsListContentProps = {
  leads: Lead[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function LeadsListContent({ leads, isLoading, isError, showStats = true }: LeadsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={leads}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun lead pour le moment."
      errorLabel="Impossible de charger les leads."
    >
      {(data) => (
        <LeadsListBody
          leads={data}
          showStats={showStats}
          onSelect={(lead) => navigate(`/leads/${lead.id}`)}
        />
      )}
    </QueryState>
  )
}

function LeadsListBody({
  leads,
  showStats,
  onSelect,
}: {
  leads: Lead[]
  showStats: boolean
  onSelect: (lead: Lead) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useLeadsListFilters(leads)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <LeadsStatsRow leads={leads} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, courriel, téléphone…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={LEAD_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as LeadStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun lead ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onClick={() => onSelect(lead)} />
          ))}
        </div>
      )}
    </div>
  )
}
