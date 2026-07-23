import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QueryState } from '@/components/ui/QueryState'
import { useRoutes } from '../hooks/useRoutes'
import { RouteCard } from '../components/RouteCard'

export function RoutesListTabPage() {
  const navigate = useNavigate()
  const { data: routes, isLoading, isError } = useRoutes()

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
          <div className="flex flex-col gap-3">
            {data.map((route) => (
              <RouteCard key={route.id} route={route} onClick={() => navigate(`/routes/${route.id}`)} />
            ))}
          </div>
        )}
      </QueryState>
    </div>
  )
}
