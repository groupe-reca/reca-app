import { Card } from '@/components/ui/Card'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Client } from '../../types/client.types'

const CLIENT_TYPE_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

const CLIENT_LANGUE_LABELS = { francais: 'Français', anglais: 'Anglais' } as const

// GPS et Statut retirés de cette carte (refonte-client) : le GPS est désormais l'affichage
// de la carte (`LocationMap`), et le statut est remonté à côté du nom dans l'en-tête.
// Les deux dates partagent maintenant le même format moyen (`formatDate`/`formatDateTime`).
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
          <p className="text-label text-reca-gray-medium">Langue</p>
          <p className="text-body font-medium text-reca-black">
            {client.langue ? CLIENT_LANGUE_LABELS[client.langue] : '—'}
          </p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Créé le</p>
          <p className="text-body font-medium text-reca-black">{formatDate(client.createdAt)}</p>
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
