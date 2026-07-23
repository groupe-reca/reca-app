import { useParams } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useMission } from '../hooks/useMission'
import { useMissionsMapData } from '../hooks/useMissionsMapData'
import { MissionDetailHeader } from '../components/detail/MissionDetailHeader'
import { MissionInfoCard } from '../components/detail/MissionInfoCard'
import { MissionProgressCard } from '../components/detail/MissionProgressCard'
import { MissionItemsList } from '../components/detail/MissionItemsList'
import { MissionNotesCard } from '../components/detail/MissionNotesCard'
import { MissionHistoryCard } from '../components/detail/MissionHistoryCard'
import { MissionMapView } from '../components/map/MissionMapView'

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: mission, isLoading } = useMission(id)
  const { data: mapPoints } = useMissionsMapData(id)

  if (isLoading || !mission || !id) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  return (
    <div className="flex flex-col gap-6">
      <MissionDetailHeader mission={mission} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="h-80 p-0 lg:h-[480px]">
            <MissionMapView points={mapPoints ?? []} className="h-full w-full rounded-card" />
          </Card>
          <MissionItemsList missionId={id} />
        </div>
        <div className="flex flex-col gap-6">
          <MissionInfoCard mission={mission} />
          <MissionProgressCard mission={mission} />
          <MissionNotesCard missionId={id} />
          <MissionHistoryCard missionId={id} />
        </div>
      </div>
    </div>
  )
}
