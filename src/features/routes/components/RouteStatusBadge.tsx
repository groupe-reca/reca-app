import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { ROUTE_STATUS_LABELS } from '../types/route.types'
import type { RouteStatus } from '../types/route.types'

const ROUTE_STATUS_COLORS: Record<RouteStatus, BadgeColor> = {
  planifiee: 'blue',
  en_cours: 'orange',
  terminee: 'green',
  suspendue: 'gray',
}

const ROUTE_STATUS_CONFIG = Object.fromEntries(
  Object.entries(ROUTE_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: ROUTE_STATUS_COLORS[status as RouteStatus] },
  ]),
) as Record<RouteStatus, { label: string; color: BadgeColor }>

export function RouteStatusBadge({ status }: { status: RouteStatus }) {
  return <StatusBadge status={status} config={ROUTE_STATUS_CONFIG} />
}
