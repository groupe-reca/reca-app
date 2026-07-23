import { Modal } from '@/components/ui/Modal'
import { useUpdateIntervention } from '../hooks/useUpdateIntervention'
import { InterventionForm } from './InterventionForm'
import type { Intervention } from '../types/intervention.types'

type InterventionFormModalProps = {
  open: boolean
  onClose: () => void
  intervention: Intervention
}

export function InterventionFormModal({ open, onClose, intervention }: InterventionFormModalProps) {
  const updateIntervention = useUpdateIntervention(intervention.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier l'intervention">
      <InterventionForm
        intervention={intervention}
        isSubmitting={updateIntervention.isPending}
        onSubmit={(values) => updateIntervention.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
