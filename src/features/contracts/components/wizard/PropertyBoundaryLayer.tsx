import { useEffect } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'

const SOURCE_ID = 'property-boundary-source'
const LAYER_ID = 'property-boundary-line'
const TRANSITION_MS = 120

type PropertyBoundaryLayerProps = {
  map: MapboxMap | null
  boundary: Polygon | null
  reveal: boolean
}

/**
 * Contrôleur invisible (pattern `PolygonEditor`) : trace le contour du terrain en rouge
 * RECA, coins arrondis via `line-join`/`line-cap`. L'opacité passe de 0 à 1 quand `reveal`
 * devient vrai (affichage progressif demandé par le sprint), via la transition Mapbox
 * native plutôt qu'une boucle d'animation React.
 */
export function PropertyBoundaryLayer({ map, boundary, reveal }: PropertyBoundaryLayerProps) {
  useEffect(() => {
    if (!map || !boundary) return

    const source = {
      type: 'geojson' as const,
      data: { type: 'Feature' as const, properties: {}, geometry: boundary },
    }

    // Ce composant ne reçoit `map` qu'une fois l'événement 'load' déjà passé (contrat de
    // `MapCanvas`/`onMapReady`) — mais `isStyleLoaded()` peut encore renvoyer `false` juste
    // après (tuiles satellite encore en cours de chargement), donc attendre un futur
    // événement 'load' ici ne se déclencherait jamais. Ajouter directement.
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, source)
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ed1c24',
          'line-width': 3,
          'line-opacity': 0,
          'line-opacity-transition': { duration: TRANSITION_MS },
        },
      })
    }

    return () => {
      try {
        if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID)
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
      } catch {
        // best-effort — la carte parente peut déjà être détruite (voir PolygonEditor)
      }
    }
  }, [map, boundary])

  useEffect(() => {
    if (!map || !map.getLayer(LAYER_ID)) return
    map.setPaintProperty(LAYER_ID, 'line-opacity', reveal ? 1 : 0)
  }, [map, reveal, boundary])

  return null
}
