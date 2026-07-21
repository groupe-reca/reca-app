import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import mapboxgl from 'mapbox-gl'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Feature, LineString } from 'geojson'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapCanvas } from '@/components/map/MapCanvas'
import { QueryState } from '@/components/ui/QueryState'
import { useRoutesMapData } from '../../hooks/useRoutesMapData'
import type { RouteMapData } from '../../services/routesMap.service'
import { boundsFromPoints } from '../../utils/mapBounds'

const DEFAULT_CENTER: [number, number] = [-73.5673, 45.5017] // Montréal, écrasé par fitBounds dès que des points existent.
const SOURCE_ID = 'routes-lines-source'
const LAYER_ID = 'routes-lines-layer'
const DEFAULT_COULEUR = '#DA291C'

/**
 * Vue Carte de `RoutesListPage` — toutes les routes actives (non terminées) et leurs
 * clients, colorées par `route.couleur`, sur une seule carte. Réutilise `MapCanvas`
 * (générique, construit pour le Wizard Contrats) sans aucune logique de dessin/polygone.
 */
export function RoutesMapView() {
  const { data, isLoading, isError } = useRoutesMapData()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={data}
      isEmpty={(routes) => routes.length === 0}
      emptyLabel="Aucune route active à afficher."
      errorLabel="Impossible de charger les routes pour la carte."
    >
      {(routes) => <RoutesMapViewContent routes={routes} />}
    </QueryState>
  )
}

function RoutesMapViewContent({ routes }: { routes: RouteMapData[] }) {
  const navigate = useNavigate()
  const [map, setMap] = useState<MapboxMap | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!map) return

    const lineFeatures: Feature<LineString>[] = routes
      .filter((route): route is RouteMapData & { traceGeojson: LineString } => route.traceGeojson !== null)
      .map((route) => ({
        type: 'Feature',
        properties: { routeId: route.id, couleur: route.couleur ?? DEFAULT_COULEUR },
        geometry: route.traceGeojson,
      }))

    // Ajout direct sans attendre 'load' : ce composant ne reçoit `map` qu'une fois cet
    // événement déjà passé (contrat MapCanvas/onMapReady) — voir PropertyBoundaryLayer.tsx.
    // La source/couche est toujours retirée par le nettoyage de l'exécution précédente
    // avant que cet effet ne rejoue (changement de `routes`), donc pas de branche
    // "mise à jour incrémentale" à gérer ici.
    const handleClick = (event: mapboxgl.MapLayerMouseEvent) => {
      const routeId = event.features?.[0]?.properties?.routeId as string | undefined
      if (routeId) navigate(`/routes/${routeId}`)
    }
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer'
    }
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = ''
    }

    map.addSource(SOURCE_ID, { type: 'geojson', data: { type: 'FeatureCollection', features: lineFeatures } })
    map.addLayer({
      id: LAYER_ID,
      type: 'line',
      source: SOURCE_ID,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': ['coalesce', ['get', 'couleur'], DEFAULT_COULEUR], 'line-width': 4 },
    })
    map.on('click', LAYER_ID, handleClick)
    map.on('mouseenter', LAYER_ID, handleMouseEnter)
    map.on('mouseleave', LAYER_ID, handleMouseLeave)

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const allPoints: [number, number][] = []
    for (const route of routes) {
      const couleur = route.couleur ?? DEFAULT_COULEUR
      for (const client of route.clients) {
        if (client.latitude == null || client.longitude == null) continue
        const position: [number, number] = [client.longitude, client.latitude]
        allPoints.push(position)
        const marker = new mapboxgl.Marker({ color: couleur })
          .setLngLat(position)
          .setPopup(new mapboxgl.Popup({ offset: 16 }).setText(`${client.prenom} ${client.nom} — ${route.nom}`))
          .addTo(map)
        marker.getElement().style.cursor = 'pointer'
        marker.getElement().addEventListener('click', () => navigate(`/routes/${route.id}`))
        markersRef.current.push(marker)
      }
    }

    const bounds = boundsFromPoints(allPoints)
    if (bounds) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 })
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      try {
        map.off('click', LAYER_ID, handleClick)
        map.off('mouseenter', LAYER_ID, handleMouseEnter)
        map.off('mouseleave', LAYER_ID, handleMouseLeave)
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
      } catch {
        // best-effort — la carte parente peut déjà être détruite au démontage
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routes])

  return (
    <div className="relative">
      <MapCanvas
        center={DEFAULT_CENTER}
        zoom={10}
        style="mapbox://styles/mapbox/streets-v12"
        className="h-[600px] w-full overflow-hidden rounded-card"
        onMapReady={setMap}
      />
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-control bg-reca-black/70 px-3 py-2 text-label text-white backdrop-blur-sm">
        {routes.map((route) => (
          <div key={route.id} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: route.couleur ?? DEFAULT_COULEUR }}
              aria-hidden="true"
            />
            {route.numero} — {route.nom}
          </div>
        ))}
      </div>
    </div>
  )
}
