import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDateLong, formatDateTime } from '@/lib/format'
import type { Client } from '../../types/client.types'

const CLIENT_TYPE_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

const CLIENT_STATUS_LABELS = { actif: 'Actif', inactif: 'Inactif' } as const
const CLIENT_STATUS_COLORS = { actif: 'green', inactif: 'gray' } as const

const CLIENT_LANGUE_LABELS = { francais: 'Français', anglais: 'Anglais' } as const

export function ClientInfoCard({ client }: { client: Client }) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="text-subtitle font-semibold text-reca-black">Détails du client</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-label text-reca-gray-medium">Type</p>
          <p className="text-body font-medium text-reca-black">
            {client.typeClient ? (CLIENT_TYPE_LABELS[client.typeClient] ?? client.typeClient) : '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">GPS</p>
          <p className="text-body font-medium text-reca-black">
            {client.latitude != null && client.longitude != null
              ? `${client.latitude.toFixed(6)}, ${client.longitude.toFixed(6)}`
              : '—'}
          </p>
        </div>
        <div>
          <p className="mb-1 text-label text-reca-gray-medium">Statut</p>
          {client.statut ? (
            <Badge color={CLIENT_STATUS_COLORS[client.statut]}>{CLIENT_STATUS_LABELS[client.statut]}</Badge>
          ) : (
            <p className="text-body text-reca-gray-medium">—</p>
          )}
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Langue</p>
          <p className="text-body font-medium text-reca-black">
            {client.langue ? CLIENT_LANGUE_LABELS[client.langue] : '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Créé le</p>
          <p className="text-body font-medium text-reca-black">{formatDateLong(client.createdAt)}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Dernière modification</p>
          <p className="text-body font-medium text-reca-black">{formatDateTime(client.updatedAt)}</p>
          {client.updatedBy?.nom && <p className="text-label text-reca-gray-medium">{client.updatedBy.nom}</p>}
        </div>
      </div>
    </Card>
  )
}
