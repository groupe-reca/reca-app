import type { BadgeColor } from '@/components/ui/Badge'
import type { MissionStatus } from '../types/mission.types'

export const MISSION_STATUS_COLORS: Record<MissionStatus, BadgeColor> = {
  planifiee: 'blue',
  en_cours: 'orange',
  terminee: 'green',
  terminee_avec_anomalies: 'yellow',
  annulee: 'gray',
}
