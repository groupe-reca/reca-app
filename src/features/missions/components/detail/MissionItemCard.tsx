import { Route, Timer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDuration } from '@/lib/format'
import { MISSION_ITEM_STATUS_LABELS, MISSION_ITEM_STATUSES } from '../../types/missionItem.types'
import type { MissionItemStatus, MissionItemSummary } from '../../types/missionItem.types'
import { MissionItemStatusBadge } from './MissionItemStatusBadge'

type MissionItemCardProps = {
  item: MissionItemSummary
  onChangeStatus: (statut: MissionItemStatus) => void
}

export function MissionItemCard({ item, onChangeStatus }: MissionItemCardProps) {
  // Durées mesurées sur le terrain par RECA Operator : affichées seulement quand la
  // résidence a été finalisée (au moins une des deux durées est présente).
  const hasDurations =
    item.dureeTrajetSecondes !== null || item.dureeInterventionSecondes !== null

  return (
    <Card id={`mission-item-${item.id}`} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-body font-semibold text-reca-black">{item.contractNumero}</span>
          <MissionItemStatusBadge status={item.statut} />
        </div>
        <span className="text-label text-reca-gray-medium">{item.clientName}</span>
        <span className="text-label text-reca-gray-medium">{item.adresse ?? '—'}</span>
        {hasDurations && (
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span className="flex items-center gap-1.5">
              <Route className="h-4 w-4 shrink-0" aria-hidden />
              Trajet&nbsp;: {formatDuration(item.dureeTrajetSecondes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4 shrink-0" aria-hidden />
              Intervention&nbsp;: {formatDuration(item.dureeInterventionSecondes)}
            </span>
          </div>
        )}
      </div>
      <select
        value={item.statut}
        onChange={(event) => onChangeStatus(event.target.value as MissionItemStatus)}
        className="h-10 rounded-control border border-reca-gray-light bg-reca-white px-3 text-label text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
      >
        {MISSION_ITEM_STATUSES.map((status) => (
          <option key={status} value={status}>
            {MISSION_ITEM_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </Card>
  )
}
