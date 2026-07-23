import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { MISSION_STATUS_LABELS } from '../types/mission.types'
import type { MissionStatus } from '../types/mission.types'
import { MISSION_STATUS_COLORS } from '../constants/missionStatusColors'

const MISSION_STATUS_CONFIG = Object.fromEntries(
  Object.entries(MISSION_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: MISSION_STATUS_COLORS[status as MissionStatus] },
  ]),
) as Record<MissionStatus, { label: string; color: BadgeColor }>

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return <StatusBadge status={status} config={MISSION_STATUS_CONFIG} />
}
