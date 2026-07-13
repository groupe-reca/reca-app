import { useEffect, useMemo, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { Camera } from 'lucide-react'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { Client } from '@/features/clients/types/client.types'
import { geocodeAddress } from '../../services/geocoding.service'
import type { GeocodeResult } from '../../services/geocoding.service'
import { usePropertyCapture } from '../../hooks/usePropertyCapture'
import { buildDemoBoundary } from '../../utils/propertyBoundary'
import { PropertyMap } from './PropertyMap'
import { PropertyBoundaryLayer } from './PropertyBoundaryLayer'
import { PropertyMaskLayer } from './PropertyMaskLayer'
import { MapViewportController } from './MapViewportController'
import { PropertyInfoPanel } from './PropertyInfoPanel'
import type { PropertyNav } from './WizardStepProperty'

const QUEBEC_CENTER: [number, number] = [-71.2082, 46.8139]

type PropertySubStepLocateProps = {
  client: Client
  contractId: string
  capturePath: string | null
  mapUnavailable: boolean
  onMapError: (message: string) => void
  onCaptured: (path: string) => void
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
  capturePath,
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

  // Placeholder de démonstration (pas de données cadastrales dans ce sprint) — stable
  // tant que le centre géocodé ne change pas, pour ne pas recréer les layers en boucle.
  const boundary: Polygon | null = useMemo(() => (showMap ? buildDemoBoundary(center) : null), [showMap, center])

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
                if (result) onCaptured(result.storagePath)
              })
            },
            disabled: !map,
            isLoading: isCapturing,
          }
        : null,
    })
    // capture/onCaptured/onContinue/onNavChange sont recréés à chaque rendu du parent —
    // seules les valeurs qui doivent réellement redéclencher un nouveau rapport de nav
    // sont listées ici (même convention que l'effet de géocodage ci-dessus).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue, showMap, map, isCapturing, boundary])

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
      <PropertyInfoPanel
        client={client}
        geocode={geocode}
        isGeocoding={isGeocoding}
        mapUnavailable={!isMapboxConfigured || mapUnavailable}
        located={revealed}
        onRecenter={() => recenter?.()}
        recenterDisabled={!recenter}
      />

      <div className="h-full min-h-0">
        {showMap ? (
          <>
            <PropertyMap center={center} onMapReady={setMap} onError={onMapError} />
            <PropertyMaskLayer map={map} boundary={boundary} reveal={revealed} />
            <PropertyBoundaryLayer map={map} boundary={boundary} reveal={revealed} />
            <MapViewportController
              map={map}
              boundary={boundary}
              onSettled={() => setRevealed(true)}
              onReady={(fn) => setRecenter(() => fn)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-card border border-dashed border-reca-gray-light bg-reca-snow px-6 text-center">
            <p className="text-body text-reca-gray-medium">
              {!isMapboxConfigured
                ? "Le géocodage automatique et la carte satellite nécessitent un token Mapbox (VITE_MAPBOX_TOKEN)."
                : mapUnavailable
                  ? 'La carte est indisponible pour le moment — ajoutez les zones manuellement à la prochaine sous-étape.'
                  : "Géocodage de l'adresse du client en cours…"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
