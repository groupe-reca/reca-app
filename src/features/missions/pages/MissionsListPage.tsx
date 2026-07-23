import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useMissions } from '../hooks/useMissions'
import { MissionsListContent } from '../components/MissionsListContent'

export function MissionsListPage() {
  const navigate = useNavigate()
  const { data: missions, isLoading, isError } = useMissions()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Missions</h1>
          <p className="text-body text-reca-gray-medium">Sorties réelles de déneigement, créées à partir des Routes.</p>
        </div>
        <Button onClick={() => navigate('/missions/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle Mission
        </Button>
      </div>
      <MissionsListContent missions={missions} isLoading={isLoading} isError={isError} />
    </div>
  )
}
