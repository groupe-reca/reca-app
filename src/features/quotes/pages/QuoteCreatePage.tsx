import { useNavigate, useSearchParams } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useLead } from '@/features/leads/hooks/useLead'
import { useUpdateLeadStatus } from '@/features/leads/hooks/useUpdateLeadStatus'
import { QuoteForm } from '../components/QuoteForm'
import { useCreateQuote } from '../hooks/useCreateQuote'

export function QuoteCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const leadId = searchParams.get('leadId') ?? ''
  const { data: lead, isLoading: isLeadLoading } = useLead(leadId)

  const createQuote = useCreateQuote(leadId || undefined)
  const updateLeadStatus = useUpdateLeadStatus(leadId)

  if (leadId && isLeadLoading) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvelle soumission</h1>
        <p className="text-body text-reca-gray-medium">
          {lead ? `Soumission pour ${lead.prenom} ${lead.nom} (${lead.numero}).` : 'Créez une soumission.'}
        </p>
      </div>

      <Card>
        <QuoteForm
          isSubmitting={createQuote.isPending}
          onSubmit={(values) =>
            createQuote.mutate(values, {
              onSuccess: (created) => {
                if (lead && (lead.statut === 'nouveau' || lead.statut === 'contacte')) {
                  updateLeadStatus.mutate('soumission_envoyee')
                }
                navigate(`/quotes/${created.id}`)
              },
            })
          }
          onCancel={() => navigate(leadId ? `/leads/${leadId}` : '/quotes')}
        />
      </Card>
    </div>
  )
}
