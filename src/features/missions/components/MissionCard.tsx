import { Card } from '@/components/ui/Card'
import { formatDateLong } from '@/lib/format'
import { MissionStatusBadge } from './MissionStatusBadge'
import type { MissionSummary } from '../types/mission.types'

type MissionCardProps = {
  mission: MissionSummary
  onClick: () => void
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="font-semibold text-reca-black">Mission #{mission.numero}</span>
          <MissionStatusBadge status={mission.statut} />
        </div>
        <span className="text-label text-reca-gray-medium">
          {formatDateLong(mission.date)} · {mission.heurePrevue}
        </span>
        <span className="text-label text-reca-gray-medium">
          {mission.routeName} · {mission.operatorName ?? '—'} · {mission.equipmentName ?? '—'}
        </span>
        <span className="text-label text-reca-gray-medium">
          {mission.itemsTerminee} / {mission.itemCount} contrat{mission.itemCount > 1 ? 's' : ''} terminé
          {mission.itemsTerminee > 1 ? 's' : ''}
        </span>
      </div>
    </Card>
  )
}
