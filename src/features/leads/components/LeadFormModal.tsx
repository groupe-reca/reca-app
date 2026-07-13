import { Modal } from '@/components/ui/Modal'
import { useUpdateLead } from '../hooks/useUpdateLead'
import { LeadForm } from './LeadForm'
import type { Lead } from '../types/lead.types'

type LeadFormModalProps = {
  open: boolean
  onClose: () => void
  lead: Lead
}

export function LeadFormModal({ open, onClose, lead }: LeadFormModalProps) {
  const updateLead = useUpdateLead(lead.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier le lead">
      <LeadForm
        lead={lead}
        isSubmitting={updateLead.isPending}
        onSubmit={(values) => updateLead.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
