import { useEffect, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { Client } from '@/features/clients/types/client.types'
import { geocodeAddress } from '../../services/geocoding.service'
import type { GeocodeResult } from '../../services/geocoding.service'
import { PropertyMap } from './PropertyMap'
import { MapCapture } from './MapCapture'

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
}

/** Sous-étape 1/3 : géocodage automatique de l'adresse du client + capture satellite. */
export function PropertySubStepLocate({
  client,
  contractId,
  capturePath,
  mapUnavailable,
  onMapError,
  onCaptured,
  onGeocoded,
  onContinue,
}: PropertySubStepLocateProps) {
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(true)
  const [map, setMap] = useState<MapboxMap | null>(null)

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

  const center: [number, number] = geocode ? [geocode.lng, geocode.lat] : QUEBEC_CENTER
  const showMap = isMapboxConfigured && !mapUnavailable && !isGeocoding
  const canContinue = showMap ? Boolean(capturePath) : true

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-1 text-subtitle font-semibold text-reca-black">Localiser la propriété</h2>
        <p className="text-body text-reca-gray-medium">
          {!isMapboxConfigured
            ? "Le géocodage automatique et la carte satellite nécessitent un token Mapbox (VITE_MAPBOX_TOKEN)."
            : mapUnavailable
              ? 'La carte est indisponible pour le moment — ajoutez les zones manuellement à la prochaine sous-étape.'
              : isGeocoding
                ? "Géocodage de l'adresse du client en cours…"
                : (geocode?.placeName ?? 'Adresse introuvable — ajustez la position sur la carte manuellement.')}
        </p>
      </Card>

      {isMapboxConfigured && !mapUnavailable && !isGeocoding && (
        <PropertyMap center={center} onMapReady={setMap} onError={onMapError} />
      )}

      <div className="flex items-center justify-between">
        {showMap && <MapCapture map={map} contractId={contractId} onCaptured={onCaptured} />}
        <Button type="button" disabled={!canContinue} onClick={onContinue} className="ml-auto">
          Continuer vers le tracé des zones
        </Button>
      </div>
    </div>
  )
}
