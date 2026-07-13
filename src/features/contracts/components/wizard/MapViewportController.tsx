import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { boundsFromPolygon } from '../../utils/propertyBoundary'

const FIT_BOUNDS_PADDING = 60
const FIT_BOUNDS_DURATION_MS = 250

type MapViewportControllerProps = {
  map: MapboxMap | null
  boundary: Polygon | null
  /** Appelé une fois la première caméra automatique stabilisée — déclenche le reveal contour/masque. */
  onSettled?: () => void
  /** Appelé avec la fonction de recentrage, pour le bouton "Recentrer la carte" du panneau info. */
  onReady?: (recenter: () => void) => void
}

/**
 * Contrôleur invisible : centre/zoome automatiquement la caméra sur le terrain
 * (`fitBounds`) dès que la carte et le contour sont prêts, puis notifie le parent une
 * fois la caméra stabilisée pour déclencher l'animation d'affichage du contour/masque.
 */
export function MapViewportController({ map, boundary, onSettled, onReady }: MapViewportControllerProps) {
  const onSettledRef = useRef(onSettled)
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onSettledRef.current = onSettled
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (!map || !boundary) return
    const activeMap = map
    const activeBoundary = boundary

    function fit() {
      activeMap.fitBounds(boundsFromPolygon(activeBoundary), {
        padding: FIT_BOUNDS_PADDING,
        duration: FIT_BOUNDS_DURATION_MS,
      })
    }

    function handleSettled() {
      onSettledRef.current?.()
    }

    map.once('moveend', handleSettled)
    fit()
    onReadyRef.current?.(fit)

    return () => {
      map.off('moveend', handleSettled)
    }
  }, [map, boundary])

  return null
}
