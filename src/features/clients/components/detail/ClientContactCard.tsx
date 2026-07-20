import { Mail, MapPin, Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StaticMapThumbnail } from '@/components/ui/StaticMapThumbnail'
import { formatAddress } from '@/lib/format'
import type { Client } from '../../types/client.types'

export function ClientContactCard({ client }: { client: Client }) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Coordonnées</h2>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2 text-body">
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
            {client.telephone ? (
              <a href={`tel:${client.telephone}`} className="text-reca-red hover:underline">
                {client.telephone}
              </a>
            ) : (
              <span className="text-reca-gray-medium">—</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
            {client.courriel ? (
              <a href={`mailto:${client.courriel}`} className="text-reca-red hover:underline">
                {client.courriel}
              </a>
            ) : (
              <span className="text-reca-gray-medium">—</span>
            )}
          </div>
          <div className="flex items-start gap-2 text-reca-gray-medium">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{formatAddress(client.adresse, client.ville, client.codePostal) || 'Adresse non renseignée'}</span>
          </div>
        </div>
        <StaticMapThumbnail
          latitude={client.latitude}
          longitude={client.longitude}
          className="size-28 shrink-0 sm:size-32"
        />
      </div>
    </Card>
  )
}
