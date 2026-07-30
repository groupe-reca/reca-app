import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { EquipmentStatusBadge } from '../EquipmentStatusBadge'
import { EQUIPMENT_STATUSES, EQUIPMENT_STATUS_LABELS } from '../../types/equipment.types'
import type { Equipment, EquipmentStatus } from '../../types/equipment.types'

type EquipmentDetailHeaderProps = {
  equipment: Equipment
  onEdit: () => void
  onChangeStatus: (status: EquipmentStatus) => void
  onDelete: () => void
}

export function EquipmentDetailHeader({ equipment, onEdit, onChangeStatus, onDelete }: EquipmentDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{equipment.numero}</p>
        <h1 className="text-section font-semibold text-reca-black">{equipment.nom}</h1>
        <div className="mt-2">
          <EquipmentStatusBadge status={equipment.statut} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={onDelete}
          className="sm:w-auto"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Supprimer
        </Button>
        <Dropdown
          className="w-full sm:w-auto"
          trigger={
            <button
              type="button"
              aria-label="Autres actions"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-control border border-reca-gray-light text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black sm:h-11 sm:w-11 sm:border-0 sm:p-0"
            >
              <MoreVertical className="size-5" aria-hidden="true" />
              <span className="sm:hidden">Plus d&apos;actions</span>
            </button>
          }
        >
          {EQUIPMENT_STATUSES.map((status) => (
            <DropdownItem key={status} onClick={() => onChangeStatus(status)}>
              Statut : {EQUIPMENT_STATUS_LABELS[status]}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>
    </div>
  )
}
