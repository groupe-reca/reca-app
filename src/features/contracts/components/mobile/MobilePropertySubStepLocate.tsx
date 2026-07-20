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
import { PropertyMapStage } from '../wizard/PropertyMapStage'
import type { PropertyNav } from '../wizard/WizardStepProperty'
import { PropertyInfoSheet } from './PropertyInfoSheet'

const QUEBEC_CENTER: [number, number] = [-71.2082, 46.8139]

type MobilePropertySubStepLocateProps = {
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
 * Sous-étape 1/3 mobile (sprint012, Phase D) — même logique de géocodage/capture/nav
 * que `PropertySubStepLocate.tsx` (Desktop, inchangé), carte plein écran avec
 * `PropertyInfoSheet` (BottomSheet) au lieu du panneau fixe 30%. Dupliquée délibérément
 * (pas d'extraction en hook comme pour Délimiter) : logique bien plus courte et déjà
 * simple ici (un seul effet de géocodage + un seul effet de nav).
 */
export function MobilePropertySubStepLocate({
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
}: MobilePropertySubStepLocateProps) {
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
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue, showMap, map, isCapturing, boundary])

  return (
    <div className="relative h-full">
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
      <PropertyInfoSheet
        client={client}
        geocode={geocode}
        isGeocoding={isGeocoding}
        mapUnavailable={!isMapboxConfigured || mapUnavailable}
        located={revealed}
        onRecenter={() => recenter?.()}
        recenterDisabled={!recenter}
      />
    </div>
  )
}
