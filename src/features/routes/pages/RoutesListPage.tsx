import { useNavigate, useSearchParams } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RouteTable } from '../components/RouteTable'
import { RoutesViewSwitcher } from '../components/RoutesViewSwitcher'
import type { RoutesViewMode } from '../components/RoutesViewSwitcher'
import { RoutesMapView } from '../components/map/RoutesMapView'
import { RoutesTimelineView } from '../components/timeline/RoutesTimelineView'
import { useRoutes } from '../hooks/useRoutes'

const VIEW_MODES: RoutesViewMode[] = ['carte', 'liste', 'timeline']

export function RoutesListPage() {
  const navigate = useNavigate()
  const { data: routes, isLoading, isError } = useRoutes()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedView = searchParams.get('vue')
  const view: RoutesViewMode = VIEW_MODES.includes(requestedView as RoutesViewMode)
    ? (requestedView as RoutesViewMode)
    : 'liste'

  function setView(mode: RoutesViewMode) {
    setSearchParams((params) => {
      params.set('vue', mode)
      return params
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Routes</h1>
          <p className="text-body text-reca-gray-medium">Tournées de déneigement.</p>
        </div>
        <Button onClick={() => navigate('/routes/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle route
        </Button>
      </div>

      <RoutesViewSwitcher value={view} onChange={setView} />

      {view === 'carte' && <RoutesMapView />}
      {view === 'liste' && <RouteTable routes={routes} isLoading={isLoading} isError={isError} />}
      {view === 'timeline' && <RoutesTimelineView />}
    </div>
  )
}
