import { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MapCanvas } from '@/components/map/MapCanvas'
import { boundsFromPoints } from '@/features/routes/utils/mapBounds'
import { MISSION_ITEM_STATUS_LABELS } from '../../types/missionItem.types'
import type { MissionMapPoint } from '../../types/missionMapPoint.types'

const DEFAULT_CENTER: [number, number] = [-73.5673, 45.5017] // Montréal, repli si aucun point

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildPopupHtml(point: MissionMapPoint): string {
  return `
    <div style="display:flex;flex-direction:column;gap:4px;font-family:Manrope,system-ui,sans-serif;min-width:180px;">
      <strong>${escapeHtml(point.adresse ?? 'Adresse inconnue')}</strong>
      <span>Client : ${escapeHtml(point.clientName)}</span>
      <span>Contrat : ${escapeHtml(point.numero)}</span>
      <span>Statut : ${escapeHtml(MISSION_ITEM_STATUS_LABELS[point.itemStatus])}</span>
    </div>
  `
}

type MissionMapViewProps = {
  points: MissionMapPoint[]
  className?: string
}

/**
 * Mirror de `RoutesMapView.tsx` (module Routes), coloré par statut de MissionItem plutôt que
 * par couleur de Route. Le clic sur un marqueur ouvre le popup ET surligne/scrolle vers la carte
 * correspondante dans `MissionItemsList` ("le clic ouvre le MissionItem" du brief) -- pas de UI
 * d'édition dans le popup Mapbox lui-même (React ne s'y rend pas).
 */
export function MissionMapView({ points, className }: MissionMapViewProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)

  useEffect(() => {
    if (!map) return

    const markers = points.map((point) => {
      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(buildPopupHtml(point))
      const marker = new mapboxgl.Marker({ color: point.color })
        .setLngLat([point.lng, point.lat])
        .setPopup(popup)
        .addTo(map)
      marker.getElement().addEventListener('click', () => {
        const target = document.getElementById(`mission-item-${point.missionItemId}`)
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return marker
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
      className={className ?? 'h-full w-full'}
      onMapReady={setMap}
    />
  )
}
