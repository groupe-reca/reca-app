import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { INTERVENTION_STATUS_LABELS } from '../types/intervention.types'
import type { InterventionStatus } from '../types/intervention.types'

const INTERVENTION_STATUS_COLORS: Record<InterventionStatus, BadgeColor> = {
  planifiee: 'gray',
  en_cours: 'blue',
  terminee: 'green',
  terminee_avec_anomalies: 'yellow',
  annulee: 'red',
}

const INTERVENTION_STATUS_CONFIG = Object.fromEntries(
  Object.entries(INTERVENTION_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: INTERVENTION_STATUS_COLORS[status as InterventionStatus] },
  ]),
) as Record<InterventionStatus, { label: string; color: BadgeColor }>

export function InterventionStatusBadge({ status }: { status: InterventionStatus }) {
  return <StatusBadge status={status} config={INTERVENTION_STATUS_CONFIG} />
}
