import { useState } from 'react'
import { QueryState } from '@/components/ui/QueryState'
import { useRoutesMapData } from '../hooks/useRoutesMapData'
import { RouteSelector } from '../components/map/RouteSelector'
import { RoutesMapView } from '../components/map/RoutesMapView'

export function CarteTabPage() {
  const { data, isLoading, isError } = useRoutesMapData()
  const [selectedRouteId, setSelectedRouteId] = useState('all')

  return (
    <QueryState isLoading={isLoading} isError={isError} data={data} errorLabel="Impossible de charger la carte.">
      {(mapData) => {
        const points =
          selectedRouteId === 'all'
            ? mapData.points
            : mapData.points.filter((point) => point.routeId === selectedRouteId)

        return (
          <div className="flex flex-col gap-4">
            <div className="max-w-xs">
              <RouteSelector routes={mapData.routes} value={selectedRouteId} onChange={setSelectedRouteId} />
            </div>
            <div className="h-[70vh] overflow-hidden rounded-card">
              <RoutesMapView points={points} />
            </div>
          </div>
        )
      }}
    </QueryState>
  )
}
