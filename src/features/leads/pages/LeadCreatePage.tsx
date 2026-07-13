import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { LeadForm } from '../components/LeadForm'
import { useCreateLead } from '../hooks/useCreateLead'

export function LeadCreatePage() {
  const navigate = useNavigate()
  const createLead = useCreateLead()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouveau lead</h1>
        <p className="text-body text-reca-gray-medium">Ajoutez une demande reçue en dehors du site web.</p>
      </div>

      <Card>
        <LeadForm
          isSubmitting={createLead.isPending}
          onSubmit={(values) =>
            createLead.mutate(values, { onSuccess: (created) => navigate(`/leads/${created.id}`) })
          }
          onCancel={() => navigate('/leads')}
        />
      </Card>
    </div>
  )
}
