import { useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { PropertyMap } from './PropertyMap'
import { PropertyBoundaryLayer } from './PropertyBoundaryLayer'
import { PropertyMaskLayer } from './PropertyMaskLayer'
import { MapViewportController } from './MapViewportController'

type PropertyMapStageProps = {
  /** Bascule entre le placeholder et la vraie carte — chaque appelant calcule sa propre condition. */
  ready: boolean
  unavailableMessage: string
  center: [number, number]
  boundary: Polygon | null
  onMapError: (message: string) => void
  onMapReady?: (map: MapboxMap) => void
  onRevealChange?: (revealed: boolean) => void
  onRecenterReady?: (recenter: () => void) => void
}

/**
 * "Vue" carte immersive partagée par les 3 sous-étapes de l'Analyse de la propriété
 * (contour rouge RECA + masque assombri + cadrage automatique sur le terrain) —
 * garantit que Localiser et Délimiter affichent exactement la même carte (tâche 3),
 * plutôt que de dupliquer cette composition dans chaque sous-étape.
 */
export function PropertyMapStage({
  ready,
  unavailableMessage,
  center,
  boundary,
  onMapError,
  onMapReady,
  onRevealChange,
  onRecenterReady,
}: PropertyMapStageProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  const [revealed, setRevealed] = useState(false)

  function handleMapReady(instance: MapboxMap) {
    setMap(instance)
    onMapReady?.(instance)
  }

  function handleSettled() {
    setRevealed(true)
    onRevealChange?.(true)
  }

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-card border border-dashed border-reca-gray-light bg-reca-snow px-6 text-center">
        <p className="text-body text-reca-gray-medium">{unavailableMessage}</p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-0">
      <PropertyMap center={center} onMapReady={handleMapReady} onError={onMapError} />
      <PropertyMaskLayer map={map} boundary={boundary} reveal={revealed} />
      <PropertyBoundaryLayer map={map} boundary={boundary} reveal={revealed} />
      <MapViewportController
        map={map}
        boundary={boundary}
        onSettled={handleSettled}
        onReady={(fn) => onRecenterReady?.(fn)}
      />
    </div>
  )
}
