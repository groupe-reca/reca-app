import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { InterventionForm } from '../components/InterventionForm'
import { useCreateIntervention } from '../hooks/useCreateIntervention'

export function InterventionCreatePage() {
  const navigate = useNavigate()
  const createIntervention = useCreateIntervention()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvelle intervention</h1>
        <p className="text-body text-reca-gray-medium">
          Planifiez une sortie réelle de déneigement à partir d'une route existante.
        </p>
      </div>

      <Card>
        <InterventionForm
          isSubmitting={createIntervention.isPending}
          onSubmit={(values) =>
            createIntervention.mutate(values, { onSuccess: (created) => navigate(`/interventions/${created.id}`) })
          }
          onCancel={() => navigate('/interventions')}
        />
      </Card>
    </div>
  )
}
