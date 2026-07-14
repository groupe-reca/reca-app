import { useEffect } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { buildMaskRects } from '../../utils/propertyBoundary'

const SOURCE_ID = 'property-mask-source'
const LAYER_ID = 'property-mask-fill'
const TRANSITION_MS = 150
const MASK_OPACITY = 0.45

type PropertyMaskLayerProps = {
  map: MapboxMap | null
  boundary: Polygon | null
  reveal: boolean
}

/**
 * Contrôleur invisible : assombrit tout ce qui est à l'extérieur du terrain via 4
 * rectangles entourant le contour (voir `buildMaskRects`) — le terrain reste net et
 * entièrement visible, seul l'environnement autour est masqué. Monté avant
 * `PropertyBoundaryLayer` dans le JSX parent pour rester visuellement en dessous du contour.
 */
export function PropertyMaskLayer({ map, boundary, reveal }: PropertyMaskLayerProps) {
  useEffect(() => {
    if (!map || !boundary) return

    const source = {
      type: 'geojson' as const,
      data: {
        type: 'FeatureCollection' as const,
        features: buildMaskRects(boundary).map((geometry) => ({
          type: 'Feature' as const,
          properties: {},
          geometry,
        })),
      },
    }

    // Ce composant ne reçoit `map` qu'une fois l'événement 'load' déjà passé (contrat de
    // `MapCanvas`/`onMapReady`) — mais `isStyleLoaded()` peut encore renvoyer `false` juste
    // après (tuiles satellite encore en cours de chargement), donc attendre un futur
    // événement 'load' ici ne se déclencherait jamais. Ajouter directement.
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, source)
      map.addLayer({
        id: LAYER_ID,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0,
          'fill-opacity-transition': { duration: TRANSITION_MS },
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
    map.setPaintProperty(LAYER_ID, 'fill-opacity', reveal ? MASK_OPACITY : 0)
  }, [map, reveal, boundary])

  return null
}
