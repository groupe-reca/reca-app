import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { LEAD_STATUS_LABELS } from '../types/lead.types'
import type { LeadStatus } from '../types/lead.types'

const LEAD_STATUS_COLORS: Record<LeadStatus, BadgeColor> = {
  nouveau: 'blue',
  contacte: 'orange',
  soumission_envoyee: 'orange',
  converti: 'green',
  perdu: 'gray',
}

const LEAD_STATUS_CONFIG = Object.fromEntries(
  Object.entries(LEAD_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: LEAD_STATUS_COLORS[status as LeadStatus] },
  ]),
) as Record<LeadStatus, { label: string; color: BadgeColor }>

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <StatusBadge status={status} config={LEAD_STATUS_CONFIG} />
}
