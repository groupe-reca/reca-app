import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InterventionsListContent } from '../../components/InterventionsListContent'
import { useInterventions } from '../../hooks/useInterventions'

export function DesktopInterventionsListPage() {
  const navigate = useNavigate()
  const { data: interventions, isLoading, isError } = useInterventions()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Interventions</h1>
          <p className="text-body text-reca-gray-medium">Sorties de déneigement réelles, exécutées à partir d'une route.</p>
        </div>
        <Button onClick={() => navigate('/interventions/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle intervention
        </Button>
      </div>

      <InterventionsListContent interventions={interventions} isLoading={isLoading} isError={isError} />
    </div>
  )
}
