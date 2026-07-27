import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileMissionLayout } from '../../components/mobile/MobileMissionLayout'
import { useMissions } from '../../hooks/useMissions'
import { MissionsListContent } from '../../components/MissionsListContent'

export function MobileMissionsListPage() {
  const navigate = useNavigate()
  const { data: missions, isLoading, isError } = useMissions()

  return (
    <MobileMissionLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/missions/new')}
          aria-label="Nouvelle Mission"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <MissionsListContent missions={missions} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileMissionLayout>
  )
}
