import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import { RouteStatusBadge } from './RouteStatusBadge'
import type { Route } from '../types/route.types'

type RouteTableProps = {
  routes: Route[] | undefined
  isLoading: boolean
  isError: boolean
}

export function RouteTable({ routes, isLoading, isError }: RouteTableProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={routes}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune route pour le moment."
      errorLabel="Impossible de charger les routes."
    >
      {(data) => <RouteTableContent routes={data} onRowClick={(route) => navigate(`/routes/${route.id}`)} />}
    </QueryState>
  )
}

function RouteTableContent({ routes, onRowClick }: { routes: Route[]; onRowClick: (route: Route) => void }) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: routes,
    searchableFields: ['numero', 'nom', 'secteur'],
  })

  const columns: TableColumn<Route>[] = [
    { key: 'numero', header: 'Numéro', sortable: true, render: (route) => route.numero },
    { key: 'nom', header: 'Nom', sortable: true, render: (route) => route.nom },
    { key: 'secteur', header: 'Secteur', render: (route) => route.secteur ?? '—' },
    { key: 'distance', header: 'Distance', render: (route) => (route.distance != null ? `${route.distance} km` : '—') },
    { key: 'statut', header: 'Statut', render: (route) => <RouteStatusBadge status={route.statut} /> },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, nom, secteur..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(route) => route.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
