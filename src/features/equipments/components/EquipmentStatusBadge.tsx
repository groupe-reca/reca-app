import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { EQUIPMENT_STATUS_LABELS } from '../types/equipment.types'
import type { EquipmentStatus } from '../types/equipment.types'

const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, BadgeColor> = {
  disponible: 'green',
  en_operation: 'blue',
  entretien: 'orange',
  brise: 'red',
}

const EQUIPMENT_STATUS_CONFIG = Object.fromEntries(
  Object.entries(EQUIPMENT_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: EQUIPMENT_STATUS_COLORS[status as EquipmentStatus] },
  ]),
) as Record<EquipmentStatus, { label: string; color: BadgeColor }>

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  return <StatusBadge status={status} config={EQUIPMENT_STATUS_CONFIG} />
}
