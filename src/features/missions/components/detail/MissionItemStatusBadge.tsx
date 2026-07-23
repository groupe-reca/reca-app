import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { MISSION_ITEM_STATUS_LABELS } from '../../types/missionItem.types'
import type { MissionItemStatus } from '../../types/missionItem.types'
import { MISSION_ITEM_STATUS_COLORS } from '../../constants/missionItemStatusColors'

const MISSION_ITEM_STATUS_CONFIG = Object.fromEntries(
  Object.entries(MISSION_ITEM_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: MISSION_ITEM_STATUS_COLORS[status as MissionItemStatus] },
  ]),
) as Record<MissionItemStatus, { label: string; color: BadgeColor }>

export function MissionItemStatusBadge({ status }: { status: MissionItemStatus }) {
  return <StatusBadge status={status} config={MISSION_ITEM_STATUS_CONFIG} />
}
