import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LeadsListContent } from '../../components/LeadsListContent'
import { useLeads } from '../../hooks/useLeads'

export function DesktopLeadsListPage() {
  const navigate = useNavigate()
  const { data: leads, isLoading, isError } = useLeads()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Leads</h1>
          <p className="text-body text-reca-gray-medium">Demandes provenant du site web.</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau lead
        </Button>
      </div>

      <LeadsListContent leads={leads} isLoading={isLoading} isError={isError} />
    </div>
  )
}
