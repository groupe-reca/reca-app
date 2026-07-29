import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { LeadFormModal } from '../../components/LeadFormModal'
import { LeadReminderCard } from '../../components/LeadReminderCard'
import { LeadDetailHeader } from '../../components/detail/LeadDetailHeader'
import { LeadInfoStrip } from '../../components/detail/LeadInfoStrip'
import { LeadNextStepCard } from '../../components/detail/LeadNextStepCard'
import { useDeleteLead } from '../../hooks/useDeleteLead'
import { useLead } from '../../hooks/useLead'
import { useUpdateLeadStatus } from '../../hooks/useUpdateLeadStatus'

export function DesktopLeadDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading, isError } = useLead(id)
  const updateStatus = useUpdateLeadStatus(id)
  const deleteLead = useDeleteLead()
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    if (!lead) return
    if (!window.confirm(`Supprimer le lead ${lead.numero} ?`)) return
    deleteLead.mutate(lead.id, { onSuccess: () => navigate('/leads') })
  }

  return (
    <QueryState isLoading={isLoading} isError={isError} data={lead} errorLabel="Impossible de charger ce lead.">
      {(leadData) => (
        <div className="flex flex-col gap-6">
          <LeadDetailHeader
            lead={leadData}
            onEdit={() => setEditOpen(true)}
            onChangeStatus={(status) => updateStatus.mutate(status)}
            onDelete={handleDelete}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LeadInfoStrip lead={leadData} />
            <LeadReminderCard lead={leadData} />
          </div>
          <LeadNextStepCard lead={leadData} />
          <LeadFormModal open={editOpen} onClose={() => setEditOpen(false)} lead={leadData} />
        </div>
      )}
    </QueryState>
  )
}
