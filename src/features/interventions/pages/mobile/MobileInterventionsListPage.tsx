import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileInterventionLayout } from '../../components/mobile/MobileInterventionLayout'
import { InterventionsListContent } from '../../components/InterventionsListContent'
import { useInterventions } from '../../hooks/useInterventions'

export function MobileInterventionsListPage() {
  const navigate = useNavigate()
  const { data: interventions, isLoading, isError } = useInterventions()

  return (
    <MobileInterventionLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/interventions/new')}
          aria-label="Nouvelle intervention"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <InterventionsListContent interventions={interventions} isLoading={isLoading} isError={isError} />
    </MobileInterventionLayout>
  )
}
