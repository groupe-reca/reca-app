import { Card } from '@/components/ui/Card'
import { MISSION_ITEM_STATUS_LABELS, MISSION_ITEM_STATUSES } from '../../types/missionItem.types'
import type { MissionItemStatus, MissionItemSummary } from '../../types/missionItem.types'
import { MissionItemStatusBadge } from './MissionItemStatusBadge'

type MissionItemCardProps = {
  item: MissionItemSummary
  onChangeStatus: (statut: MissionItemStatus) => void
}

export function MissionItemCard({ item, onChangeStatus }: MissionItemCardProps) {
  return (
    <Card id={`mission-item-${item.id}`} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-body font-semibold text-reca-black">{item.contractNumero}</span>
          <MissionItemStatusBadge status={item.statut} />
        </div>
        <span className="text-label text-reca-gray-medium">{item.clientName}</span>
        <span className="text-label text-reca-gray-medium">{item.adresse ?? '—'}</span>
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
