import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { boundsFromPolygon } from '../../utils/propertyBoundary'

const FIT_BOUNDS_PADDING = 20
const FIT_BOUNDS_DURATION_MS = 250

type MapViewportControllerProps = {
  map: MapboxMap | null
  boundary: Polygon | null
  /**
   * `false` quand la carte a déjà été créée sur un cadrage choisi par l'utilisateur
   * (viewport capturé à l'étape Localiser) — dans ce cas la caméra est déjà correcte dès
   * la création de la carte, `fitBounds()` ne doit pas s'exécuter (il écraserait ce
   * cadrage). `true` (comportement d'origine) pour le tout premier affichage.
   */
  autoFit: boolean
  /** Appelé une fois la première caméra automatique stabilisée — déclenche le reveal contour/masque. */
  onSettled?: () => void
  /** Appelé avec la fonction de recentrage, pour le bouton "Recentrer la carte" du panneau info. */
  onReady?: (recenter: () => void) => void
}

/**
 * Contrôleur invisible : centre/zoome automatiquement la caméra sur le terrain
 * (`fitBounds`) dès que la carte et le contour sont prêts, puis notifie le parent une
 * fois la caméra stabilisée pour déclencher l'animation d'affichage du contour/masque.
 * Le recentrage manuel (`onReady`) reste toujours branché, que `autoFit` soit actif ou non.
 */
export function MapViewportController({ map, boundary, autoFit, onSettled, onReady }: MapViewportControllerProps) {
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

    onReadyRef.current?.(fit)

    if (!autoFit) {
      // La caméra a déjà le bon cadrage (viewport capturé passé à la création de la
      // carte) — aucun mouvement de caméra n'aura lieu, donc aucun `moveend` à attendre.
      handleSettled()
      return
    }

    map.once('moveend', handleSettled)
    fit()

    return () => {
      map.off('moveend', handleSettled)
    }
  }, [map, boundary, autoFit])

  return null
}
