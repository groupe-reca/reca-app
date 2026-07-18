import { Mail, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { Card } from '@/components/ui/Card'
import { ListRow } from '@/components/ui/ListRow'
import { formatAddress } from '@/lib/format'
import type { ContractClientRef } from '../../types/contract.types'

export function ContractClientCard({ client }: { client: ContractClientRef | null }) {
  if (!client) {
    return (
      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client</h2>
        <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-subtitle font-semibold text-reca-black">
          <Link to={`/clients/${client.id}`} className="text-reca-red hover:underline">
            {client.prenom} {client.nom}
          </Link>
        </h2>
        <p className="text-label text-reca-gray-medium">{client.numero}</p>
      </div>
      <div className="flex flex-col gap-2 text-body">
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
        <p className="text-reca-gray-medium">
          {formatAddress(client.adresse, client.ville, client.codePostal) || 'Adresse non renseignée'}
        </p>
      </div>
      <ListRow href={`/clients/${client.id}`} title="Voir la fiche client" chevron />
    </Card>
  )
}
