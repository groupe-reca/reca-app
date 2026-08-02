import { Mail, MapPin, Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Link } from '@/components/ui/Link'
import { formatAddress } from '@/lib/format'
import type { Client } from '../../types/client.types'

function mapsUrl(client: Client): string | null {
  const query =
    client.latitude != null && client.longitude != null
      ? `${client.latitude},${client.longitude}`
      : formatAddress(client.adresse, client.ville, client.codePostal)
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function ClientContactCard({ client }: { client: Client }) {
  const address = formatAddress(client.adresse, client.ville, client.codePostal)
  const maps = mapsUrl(client)

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Coordonnées</h2>
      <div className="flex flex-col gap-2 text-body">
        <div className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
          {client.telephone ? (
            <Link href={`tel:${client.telephone}`}>{client.telephone}</Link>
          ) : (
            <span className="text-reca-gray-medium">—</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
          {client.courriel ? (
            <Link href={`mailto:${client.courriel}`} className="truncate">
              {client.courriel}
            </Link>
          ) : (
            <span className="text-reca-gray-medium">—</span>
          )}
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
          {address && maps ? (
            <Link href={maps} target="_blank" rel="noreferrer">
              {address}
            </Link>
          ) : (
            <span className="text-reca-gray-medium">{address || 'Adresse non renseignée'}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
