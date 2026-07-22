import { Route as RouteIcon, Truck, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDateLong } from '@/lib/format'
import { InterventionStatusBadge } from './InterventionStatusBadge'
import type { Intervention } from '../types/intervention.types'

type InterventionCardProps = {
  intervention: Intervention
  onClick: () => void
}

export function InterventionCard({ intervention, onClick }: InterventionCardProps) {
  const heure = intervention.heurePrevue ? intervention.heurePrevue.slice(0, 5) : null

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div>
            <p className="text-label text-reca-gray-medium">{intervention.numero}</p>
            <p className="font-medium text-reca-black">
              {formatDateLong(intervention.date)}
              {heure && ` · ${heure}`}
            </p>
          </div>
          <InterventionStatusBadge status={intervention.statut} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-reca-gray-medium">
          <span className="flex items-center gap-1.5">
            <RouteIcon className="size-3.5" aria-hidden="true" />
            {intervention.route?.nom ?? '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" aria-hidden="true" />
            {intervention.employee ? `${intervention.employee.prenom} ${intervention.employee.nom}` : '—'}
          </span>
          {intervention.equipment && (
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5" aria-hidden="true" />
              {intervention.equipment.nom}
            </span>
          )}
        </div>

        {intervention.residencesTotal > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-reca-gray-light">
              <div
                className="h-full rounded-full bg-reca-success"
                style={{ width: `${Math.round((intervention.residencesCompleted / intervention.residencesTotal) * 100)}%` }}
              />
            </div>
            <span className="shrink-0 text-label text-reca-gray-medium">
              {intervention.residencesCompleted}/{intervention.residencesTotal} résidences
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
