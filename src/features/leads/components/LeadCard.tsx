import { User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDateLong, formatPhone } from '@/lib/format'
import { LeadStatusBadge } from './LeadStatusBadge'
import type { Lead } from '../types/lead.types'

type LeadCardProps = {
  lead: Lead
  onClick: () => void
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <User className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">
              {lead.prenom} {lead.nom}
            </span>
            <LeadStatusBadge status={lead.statut} />
          </div>
          <p className="truncate text-label text-reca-gray-medium">
            {formatPhone(lead.telephone) || lead.courriel || '—'}
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>
              {lead.typeService ?? '—'} · Créé le {formatDateLong(lead.createdAt)}
            </span>
            <span>{lead.numero}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
