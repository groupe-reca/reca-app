import { useEffect, useState } from 'react'
import { CheckCircle2, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { isMapboxConfigured, MAPBOX_TOKEN } from '@/lib/mapboxClient'
import { formatAddress } from '@/lib/format'
import type { Client } from '@/features/clients/types/client.types'
import { geocodeAddress } from '../../services/geocoding.service'
import type { GeocodeResult } from '../../services/geocoding.service'

type AddressPreviewCardProps = {
  client: Client
  onOpenMeasurementTool: () => void
}

/**
 * Validation visuelle rapide de l'adresse dès le client sélectionné (étape 1) — une
 * simple vignette satellite statique (Mapbox Static Images API, pas une carte
 * interactive) + confirmation du géocodage. L'analyse complète (tracé de zones,
 * carte interactive) est désormais optionnelle (tâche 5) — déclenchée uniquement par
 * le bouton "Outil de mesure" ci-dessous, jamais automatiquement.
 */
export function AddressPreviewCard({ client, onOpenMeasurementTool }: AddressPreviewCardProps) {
  const [geocode, setGeocode] = useState<GeocodeResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setIsLoading(true)
    })
    geocodeAddress(client.adresse, client.ville, client.codePostal)
      .then((result) => {
        if (!cancelled) setGeocode(result)
      })
      .catch(() => {
        if (!cancelled) setGeocode(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client.id, client.adresse, client.ville, client.codePostal])

  const thumbnailUrl =
    isMapboxConfigured && geocode
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${geocode.lng},${geocode.lat},18,0/320x180@2x?access_token=${MAPBOX_TOKEN}`
      : null

  const formattedAddress = formatAddress(client.adresse, client.ville, client.codePostal)

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-4">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Aperçu satellite de la propriété"
            className="h-24 w-40 shrink-0 rounded-control object-cover"
          />
        )}
        <div className="flex flex-col justify-center gap-1">
          {isLoading ? (
            <p className="text-label text-reca-gray-medium">Géocodage de l'adresse en cours…</p>
          ) : geocode ? (
            <>
              <div className="flex items-center gap-2 text-reca-success">
                <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
                <h3 className="text-body font-semibold">Adresse Validée</h3>
              </div>
              <p className="text-label text-reca-black">{formattedAddress || geocode.placeName}</p>
            </>
          ) : (
            <p className="text-label text-reca-gray-medium">
              {formattedAddress || 'Adresse non renseignée'} — géocodage indisponible.
            </p>
          )}
        </div>
      </div>
      <Button type="button" variant="secondary" onClick={onOpenMeasurementTool}>
        <Ruler className="size-4" aria-hidden="true" />
        Outil de mesure
      </Button>
    </Card>
  )
}
