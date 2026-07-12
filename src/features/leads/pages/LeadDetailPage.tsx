import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { QuoteFormModal } from '@/features/quotes/components/QuoteFormModal'
import { useDeleteLead } from '../hooks/useDeleteLead'
import { useLead } from '../hooks/useLead'
import { useUpdateLeadStatus } from '../hooks/useUpdateLeadStatus'
import { LeadFormModal } from '../components/LeadFormModal'
import { LeadReminderCard } from '../components/LeadReminderCard'
import { LeadStatusBadge } from '../components/LeadStatusBadge'
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from '../types/lead.types'

export function LeadDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading } = useLead(id)
  const updateStatus = useUpdateLeadStatus(id)
  const deleteLead = useDeleteLead()
  const [editOpen, setEditOpen] = useState(false)
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)

  if (isLoading || !lead) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!lead) return
    if (!window.confirm(`Supprimer le lead ${lead.numero} ?`)) return
    deleteLead.mutate(lead.id, { onSuccess: () => navigate('/leads') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{lead.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">
            {lead.prenom} {lead.nom}
          </h1>
          <div className="mt-2">
            <LeadStatusBadge status={lead.statut} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {LEAD_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {LEAD_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Coordonnées</h2>
          <div className="flex flex-col gap-2 text-body">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {lead.telephone ? (
                <a href={`tel:${lead.telephone}`} className="text-reca-red hover:underline">
                  {lead.telephone}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {lead.courriel ? (
                <a href={`mailto:${lead.courriel}`} className="text-reca-red hover:underline">
                  {lead.courriel}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
            <p className="text-reca-gray-medium">
              {[lead.adresse, lead.ville, lead.codePostal].filter(Boolean).join(', ') ||
                'Adresse non renseignée'}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Service : {lead.typeService ?? '—'}</p>
            <p>Source : {lead.source ?? '—'}</p>
            <p>Message : {lead.message ?? '—'}</p>
          </div>
        </Card>
      </div>

      <LeadReminderCard lead={lead} />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-subtitle font-semibold text-reca-black">Prochaine étape</h2>
            <p className="text-body text-reca-gray-medium">Créer une soumission pour ce lead.</p>
          </div>
          <Button variant="secondary" onClick={() => setQuoteModalOpen(true)}>
            Créer une soumission
          </Button>
        </div>
      </Card>

      <LeadFormModal open={editOpen} onClose={() => setEditOpen(false)} lead={lead} />

      <QuoteFormModal
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        leadId={lead.id}
        onCreated={(quote) => {
          if (lead.statut === 'nouveau' || lead.statut === 'contacte') {
            updateStatus.mutate('soumission_envoyee')
          }
          navigate(`/quotes/${quote.id}`)
        }}
      />
    </div>
  )
}
