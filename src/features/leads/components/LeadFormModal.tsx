import { Modal } from '@/components/ui/Modal'
import { useCreateLead } from '../hooks/useCreateLead'
import { useUpdateLead } from '../hooks/useUpdateLead'
import { LeadForm } from './LeadForm'
import type { LeadFormValues } from '../schemas/lead.schema'
import type { Lead } from '../types/lead.types'

type LeadFormModalProps = {
  open: boolean
  onClose: () => void
  lead?: Lead
}

export function LeadFormModal({ open, onClose, lead }: LeadFormModalProps) {
  const createLead = useCreateLead()
  const updateLead = useUpdateLead(lead?.id ?? '')
  const isEditing = Boolean(lead)

  function handleSubmit(values: LeadFormValues) {
    if (isEditing && lead) {
      updateLead.mutate(values, { onSuccess: onClose })
    } else {
      createLead.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier le lead' : 'Nouveau lead'}>
      <LeadForm
        lead={lead}
        isSubmitting={isEditing ? updateLead.isPending : createLead.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
