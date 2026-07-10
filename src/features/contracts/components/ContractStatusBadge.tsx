import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { CONTRACT_STATUS_LABELS } from '../types/contract.types'
import type { ContractStatus } from '../types/contract.types'

const CONTRACT_STATUS_COLORS: Record<ContractStatus, BadgeColor> = {
  actif: 'green',
  en_attente: 'orange',
  expire: 'gray',
  annule: 'red',
}

const CONTRACT_STATUS_CONFIG = Object.fromEntries(
  Object.entries(CONTRACT_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: CONTRACT_STATUS_COLORS[status as ContractStatus] },
  ]),
) as Record<ContractStatus, { label: string; color: BadgeColor }>

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return <StatusBadge status={status} config={CONTRACT_STATUS_CONFIG} />
}
