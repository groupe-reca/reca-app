import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { useRoutes } from '../hooks/useRoutes'
import { RouteCard } from '../components/RouteCard'
import { RoutesStatsRow } from '../components/RoutesStatsRow'

export function RoutesListTabPage() {
  const navigate = useNavigate()
  const { data: routes, isLoading, isError } = useRoutes()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!routes) return []
    const term = search.trim().toLowerCase()
    if (!term) return routes
    return routes.filter((route) =>
      [route.nom, route.operatorName ?? '', route.equipmentName ?? ''].join(' ').toLowerCase().includes(term),
    )
  }, [routes, search])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate('/routes/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle Route
        </Button>
      </div>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={routes}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucune route pour le moment."
        errorLabel="Impossible de charger les routes."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            <RoutesStatsRow routes={data} />

            <Input
              label="Rechercher"
              icon={Search}
              placeholder="Nom, opérateur, équipement…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
                Aucune route ne correspond à cette recherche.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((route) => (
                  <RouteCard key={route.id} route={route} onClick={() => navigate(`/routes/${route.id}`)} />
                ))}
              </div>
            )}
          </div>
        )}
      </QueryState>
    </div>
  )
}
