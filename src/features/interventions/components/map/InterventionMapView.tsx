import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Map as MapboxMap } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapCanvas } from '@/components/map/MapCanvas'
import { boundsFromPoints } from '@/features/routes/utils/mapBounds'
import { InterventionItemDetailModal } from '../detail/InterventionItemDetailModal'
import { INTERVENTION_ITEM_STATUS_LABELS } from '../../types/interventionItem.types'
import type { InterventionItem, InterventionItemStatus } from '../../types/interventionItem.types'

const DEFAULT_CENTER: [number, number] = [-73.5673, 45.5017] // Montréal, écrasé par fitBounds dès que des points existent.

const STATUS_MARKER_COLORS: Record<InterventionItemStatus, string> = {
  terminee: '#16A34A',
  en_cours: '#2563EB',
  a_reprendre: '#F97316',
  planifiee: '#9CA3AF',
}

type InterventionMapViewProps = {
  interventionId: string
  items: InterventionItem[]
}

/**
 * Reçoit les `items` déjà chargés par la page détail (pas de fetch propre, contrairement à
 * `RoutesMapView` qui agrège plusieurs routes) — Progression/Carte/Résidences partagent la
 * même requête. Mirrors la structure (source/layer sans attendre `load`, marqueurs trackés
 * dans un `useRef`, cleanup) de `RoutesMapView.tsx`, sans les lignes (pas de tracé par item).
 */
export function InterventionMapView({ interventionId, items }: InterventionMapViewProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [selectedItem, setSelectedItem] = useState<InterventionItem | null>(null)

  useEffect(() => {
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const points: [number, number][] = []
    for (const item of items) {
      if (item.client?.latitude == null || item.client?.longitude == null) continue
      const position: [number, number] = [item.client.longitude, item.client.latitude]
      points.push(position)

      const marker = new mapboxgl.Marker({ color: STATUS_MARKER_COLORS[item.statut] })
        .setLngLat(position)
        .setPopup(
          new mapboxgl.Popup({ offset: 16 }).setText(
            `${item.client.prenom} ${item.client.nom} — ${INTERVENTION_ITEM_STATUS_LABELS[item.statut]}`,
          ),
        )
        .addTo(map)
      marker.getElement().style.cursor = 'pointer'
      marker.getElement().addEventListener('click', () => setSelectedItem(item))
      markersRef.current.push(marker)
    }

    const bounds = boundsFromPoints(points)
    if (bounds) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 17, duration: 0 })
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
    }
  }, [map, items])

  return (
    <div className="relative">
      <MapCanvas
        center={DEFAULT_CENTER}
        zoom={12}
        style="mapbox://styles/mapbox/streets-v12"
        className="h-[480px] w-full overflow-hidden rounded-card"
        onMapReady={setMap}
      />
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-control bg-reca-black/70 px-3 py-2 text-label text-white backdrop-blur-sm">
        {(Object.entries(STATUS_MARKER_COLORS) as [InterventionItemStatus, string][]).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
            {INTERVENTION_ITEM_STATUS_LABELS[status]}
          </div>
        ))}
      </div>

      {selectedItem && (
        <InterventionItemDetailModal
          open
          onClose={() => setSelectedItem(null)}
          interventionId={interventionId}
          item={selectedItem}
        />
      )}
    </div>
  )
}
