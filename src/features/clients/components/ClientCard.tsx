import { User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatAddress, formatPhone } from '@/lib/format'
import type { Client } from '../types/client.types'

/** Duplication délibérée du badge type de `ClientSearchPicker.tsx` — les deux composants n'ont pas vocation à être couplés (l'un est une liste, l'autre un sélecteur interne au Wizard Contrats). */
const CLIENT_TYPE_BADGE: Record<string, { label: string; color: 'blue' | 'orange' }> = {
  residentiel: { label: 'Résidentiel', color: 'blue' },
  commercial: { label: 'Commercial', color: 'orange' },
}

type ClientCardProps = {
  client: Client
  onClick: () => void
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  const typeBadge = client.typeClient ? CLIENT_TYPE_BADGE[client.typeClient] : undefined

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <User className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">
              {client.prenom} {client.nom}
              {client.entreprise ? ` — ${client.entreprise}` : ''}
            </span>
            <div className="flex items-center gap-2">
              {typeBadge && (
                <Badge color={typeBadge.color} size="sm">
                  {typeBadge.label}
                </Badge>
              )}
              <Badge color={client.statut === 'actif' ? 'green' : 'gray'}>
                {client.statut === 'actif' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
          <p className="truncate text-label text-reca-gray-medium">
            {formatAddress(client.adresse, client.ville, client.codePostal) || 'Adresse non renseignée'}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>{formatPhone(client.telephone) || '—'}</span>
            <span>{client.numero}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
