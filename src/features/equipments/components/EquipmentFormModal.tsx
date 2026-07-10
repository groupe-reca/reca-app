import { Modal } from '@/components/ui/Modal'
import { useCreateEquipment } from '../hooks/useCreateEquipment'
import { useUpdateEquipment } from '../hooks/useUpdateEquipment'
import { EquipmentForm } from './EquipmentForm'
import type { EquipmentFormValues } from '../schemas/equipment.schema'
import type { Equipment } from '../types/equipment.types'

type EquipmentFormModalProps = {
  open: boolean
  onClose: () => void
  equipment?: Equipment
}

export function EquipmentFormModal({ open, onClose, equipment }: EquipmentFormModalProps) {
  const createEquipment = useCreateEquipment()
  const updateEquipment = useUpdateEquipment(equipment?.id ?? '')
  const isEditing = Boolean(equipment)

  function handleSubmit(values: EquipmentFormValues) {
    if (isEditing && equipment) {
      updateEquipment.mutate(values, { onSuccess: onClose })
    } else {
      createEquipment.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier l’équipement' : 'Nouvel équipement'}>
      <EquipmentForm
        equipment={equipment}
        isSubmitting={isEditing ? updateEquipment.isPending : createEquipment.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
