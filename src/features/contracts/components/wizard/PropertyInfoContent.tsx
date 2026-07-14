import { CheckCircle2, LocateFixed, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Client } from '@/features/clients/types/client.types'
import type { GeocodeResult } from '../../services/geocoding.service'

export type PropertyInfoContentProps = {
  client: Client
  geocode: GeocodeResult | null
  isGeocoding: boolean
  mapUnavailable: boolean
  located: boolean
  onRecenter: () => void
  recenterDisabled: boolean
}

/**
 * Contenu pur (sans le conteneur `Card`) de l'identité de propriété + état de
 * localisation — extrait de `PropertyInfoPanel.tsx` (sprint012) pour être réutilisé
 * tel quel par `PropertyInfoPanel` (Desktop, dans une `Card`) et `PropertyInfoSheet`
 * (Mobile, dans un `BottomSheet`), sans dupliquer ce JSX.
 */
export function PropertyInfoContent({
  client,
  geocode,
  isGeocoding,
  mapUnavailable,
  located,
  onRecenter,
  recenterDisabled,
}: PropertyInfoContentProps) {
  const statusMessage = mapUnavailable
    ? 'La carte est indisponible pour le moment — ajoutez les zones manuellement à la prochaine sous-étape.'
    : isGeocoding
      ? "Géocodage de l'adresse du client en cours…"
      : !geocode
        ? 'Adresse introuvable — ajustez la position sur la carte manuellement.'
        : null

  return (
    <>
      <div className="flex items-center gap-2 text-reca-black">
        <MapPin className="size-4 text-reca-red" aria-hidden="true" />
        <h2 className="text-subtitle font-semibold">Propriété</h2>
      </div>

      <dl className="flex flex-col gap-3 text-body">
        <div>
          <dt className="text-label text-reca-gray-medium">Adresse complète</dt>
          <dd className="text-reca-black">{geocode?.placeName ?? client.adresse ?? '—'}</dd>
        </div>
        <div className="flex gap-6">
          <div>
            <dt className="text-label text-reca-gray-medium">Ville</dt>
            <dd className="text-reca-black">{client.ville ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-label text-reca-gray-medium">Code postal</dt>
            <dd className="text-reca-black">{client.codePostal ?? '—'}</dd>
          </div>
        </div>
        <div>
          <dt className="text-label text-reca-gray-medium">Coordonnées GPS</dt>
          <dd className="text-reca-black">{geocode ? `${geocode.lat.toFixed(6)}, ${geocode.lng.toFixed(6)}` : '—'}</dd>
        </div>
      </dl>

      {located ? (
        <Badge color="green">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            Propriété localisée
          </span>
        </Badge>
      ) : (
        statusMessage && <p className="text-label text-reca-gray-medium">{statusMessage}</p>
      )}

      <Button type="button" variant="secondary" disabled={recenterDisabled} onClick={onRecenter}>
        <LocateFixed className="size-4" aria-hidden="true" />
        Recentrer la carte
      </Button>
    </>
  )
}
