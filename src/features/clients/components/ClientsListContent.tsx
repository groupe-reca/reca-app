import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { ClientCard } from './ClientCard'
import { ClientsStatsRow } from './ClientsStatsRow'
import { CLIENT_STATUS_FILTER_OPTIONS, useClientsListFilters } from '../hooks/useClientsListFilters'
import type { ClientStatusFilter } from '../hooks/useClientsListFilters'
import type { Client } from '../types/client.types'

type ClientsListContentProps = {
  clients: Client[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function ClientsListContent({ clients, isLoading, isError, showStats = true }: ClientsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={clients}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun client pour le moment."
      errorLabel="Impossible de charger les clients."
    >
      {(data) => (
        <ClientsListBody
          clients={data}
          showStats={showStats}
          onSelect={(client) => navigate(`/clients/${client.id}`)}
        />
      )}
    </QueryState>
  )
}

function ClientsListBody({
  clients,
  showStats,
  onSelect,
}: {
  clients: Client[]
  showStats: boolean
  onSelect: (client: Client) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useClientsListFilters(clients)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <ClientsStatsRow clients={clients} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, entreprise, courriel, téléphone…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={CLIENT_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as ClientStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun client ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} onClick={() => onSelect(client)} />
          ))}
        </div>
      )}
    </div>
  )
}
