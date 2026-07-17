import { useEffect, useMemo, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { Camera } from 'lucide-react'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { Client } from '@/features/clients/types/client.types'
import { geocodeAddress } from '../../services/geocoding.service'
import type { GeocodeResult } from '../../services/geocoding.service'
import { usePropertyCapture } from '../../hooks/usePropertyCapture'
import type { MapViewport } from '../../hooks/usePropertyCapture'
import { PropertyMapStage } from './PropertyMapStage'
import { PropertyInfoPanel } from './PropertyInfoPanel'
import type { PropertyNav } from './WizardStepProperty'

const QUEBEC_CENTER: [number, number] = [-71.2082, 46.8139]

type PropertySubStepLocateProps = {
  client: Client
  contractId: string
  boundary: Polygon
  capturePath: string | null
  /** Cadrage déjà capturé (persiste entre les sous-étapes) — voir `PropertyMapStage`. */
  initialViewport: MapViewport | null
  mapUnavailable: boolean
  onMapError: (message: string) => void
  onCaptured: (path: string, viewport: MapViewport) => void
  onGeocoded: (result: GeocodeResult | null) => void
  onContinue: () => void
  onNavChange: (nav: PropertyNav) => void
}

/**
 * Sous-étape 1/3 : géocodage automatique de l'adresse du client, puis expérience
 * immersive (sprint008) — la carte se centre/zoome automatiquement sur le terrain, un
 * contour de démonstration est tracé en rouge RECA et tout ce qui est à l'extérieur est
 * assombri. Depuis sprint008.5 : la carte remplit tout l'espace disponible (plus de
 * boutons flottants ici) et l'action Capturer + le Suivant sont rapportés au Footer du
 * Wizard via `onNavChange`, jamais rendus dans la zone de travail.
 */
export function PropertySubStepLocate({
  client,
  contractId,
  boundary,
  capturePath,
  initialViewport,
  mapUnavailable,
  onMapError,
  onCaptured,
  onGeocoded,
  onContinue,
  onNavChange,
}: PropertySubStepLocateProps) {
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(true)
  const [map, setMap] = useState<MapboxMap | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [recenter, setRecenter] = useState<(() => void) | null>(null)

  useEffect(() => {
    let cancelled = false
    geocodeAddress(client.adresse, client.ville, client.codePostal)
      .then((result) => {
        if (cancelled) return
        setGeocode(result)
        onGeocoded(result)
      })
      .catch(() => {
        if (!cancelled) onGeocoded(null)
      })
      .finally(() => {
        if (!cancelled) setIsGeocoding(false)
      })
    return () => {
      cancelled = true
    }
    // onGeocoded change de référence à chaque rendu du parent — seul un changement
    // de client doit relancer le géocodage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id])

  const center: [number, number] = useMemo(() => (geocode ? [geocode.lng, geocode.lat] : QUEBEC_CENTER), [geocode])
  const showMap = isMapboxConfigured && !mapUnavailable && !isGeocoding
  const canContinue = showMap ? Boolean(capturePath) : true

  const { capture, isCapturing } = usePropertyCapture(map, contractId, boundary)

  useEffect(() => {
    onNavChange({
      onNext: onContinue,
      nextDisabled: !canContinue,
      action: showMap
        ? {
            label: 'Capturer',
            icon: Camera,
            onClick: () => {
              void capture().then((result) => {
                if (result) onCaptured(result.storagePath, result.viewport)
              })
            },
            disabled: !map,
            isLoading: isCapturing,
          }
        : null,
      immersive: showMap,
    })
    // capture/onCaptured/onContinue/onNavChange sont recréés à chaque rendu du parent —
    // seules les valeurs qui doivent réellement redéclencher un nouveau rapport de nav
    // sont listées ici (même convention que l'effet de géocodage ci-dessus).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue, showMap, map, isCapturing, boundary])

  const infoPanel = (
    <PropertyInfoPanel
      client={client}
      geocode={geocode}
      isGeocoding={isGeocoding}
      mapUnavailable={!isMapboxConfigured || mapUnavailable}
      located={revealed}
      onRecenter={() => recenter?.()}
      recenterDisabled={!recenter}
    />
  )

  const mapStage = (
    <PropertyMapStage
      ready={showMap}
      unavailableMessage={
        !isMapboxConfigured
          ? "Le géocodage automatique et la carte satellite nécessitent un token Mapbox (VITE_MAPBOX_TOKEN)."
          : mapUnavailable
            ? 'La carte est indisponible pour le moment — ajoutez les zones manuellement à la prochaine sous-étape.'
            : "Géocodage de l'adresse du client en cours…"
      }
      center={center}
      boundary={boundary}
      initialViewport={initialViewport}
      onMapError={onMapError}
      onMapReady={setMap}
      onRevealChange={setRevealed}
      onRecenterReady={(fn) => setRecenter(() => fn)}
    />
  )

  if (!showMap) {
    return (
      <div className="grid h-full grid-cols-1 gap-4 px-4 pb-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:px-8">
        {infoPanel}
        {mapStage}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">{mapStage}</div>
      <div className="absolute left-4 top-4 z-20 w-80 max-h-[calc(100%-2rem)] overflow-y-auto">{infoPanel}</div>
    </div>
  )
}
