import { Modal } from '@/components/ui/Modal'
import { useUpdateEquipment } from '../hooks/useUpdateEquipment'
import { EquipmentForm } from './EquipmentForm'
import type { Equipment } from '../types/equipment.types'

type EquipmentFormModalProps = {
  open: boolean
  onClose: () => void
  equipment: Equipment
}

export function EquipmentFormModal({ open, onClose, equipment }: EquipmentFormModalProps) {
  const updateEquipment = useUpdateEquipment(equipment.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier l’équipement">
      <EquipmentForm
        equipment={equipment}
        isSubmitting={updateEquipment.isPending}
        onSubmit={(values) => updateEquipment.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
