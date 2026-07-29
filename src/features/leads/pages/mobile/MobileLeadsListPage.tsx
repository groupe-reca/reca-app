import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileLeadLayout } from '../../components/mobile/MobileLeadLayout'
import { LeadsListContent } from '../../components/LeadsListContent'
import { useLeads } from '../../hooks/useLeads'

export function MobileLeadsListPage() {
  const navigate = useNavigate()
  const { data: leads, isLoading, isError } = useLeads()

  return (
    <MobileLeadLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/leads/new')}
          aria-label="Nouveau lead"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <LeadsListContent leads={leads} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileLeadLayout>
  )
}
