import { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MapCanvas } from '@/components/map/MapCanvas'
import { boundsFromPoints } from '../../utils/mapBounds'
import type { RouteMapPoint } from '../../types/routeMapPoint.types'

const DEFAULT_CENTER: [number, number] = [-73.5673, 45.5017] // Montréal, repli si aucun point

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildPopupHtml(point: RouteMapPoint): string {
  return `
    <div style="display:flex;flex-direction:column;gap:4px;font-family:Manrope,system-ui,sans-serif;min-width:180px;">
      <strong>${escapeHtml(point.adresse ?? 'Adresse inconnue')}</strong>
      <span>Client : ${escapeHtml(point.clientName)}</span>
      <span>Contrat : ${escapeHtml(point.numero)}</span>
      <span>Route : ${escapeHtml(point.routeName)}</span>
      <span>Statut : ${escapeHtml(point.statut)}</span>
    </div>
  `
}

type RoutesMapViewProps = {
  points: RouteMapPoint[]
}

/**
 * Aucun composant Marker/Popup Mapbox n'existait encore dans ce repo — pattern écrit à neuf
 * (un `mapboxgl.Marker` par point, plutôt qu'une source/layer GeoJSON : le volume de points
 * reste faible, dizaines pas milliers).
 */
export function RoutesMapView({ points }: RoutesMapViewProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)

  useEffect(() => {
    if (!map) return

    const markers = points.map((point) => {
      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(buildPopupHtml(point))
      return new mapboxgl.Marker({ color: point.routeColor })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(map)
    })

    if (points.length > 0) {
      const bounds = boundsFromPoints(points.map((point) => [point.lng, point.lat] as [number, number]))
      if (bounds) map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 0 })
    }

    return () => {
      markers.forEach((marker) => marker.remove())
    }
  }, [map, points])

  return (
    <MapCanvas
      center={DEFAULT_CENTER}
      zoom={10}
      style="mapbox://styles/mapbox/streets-v12"
      className="h-full w-full"
      onMapReady={setMap}
    />
  )
}
