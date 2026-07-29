import { useParams } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useMission } from '../../hooks/useMission'
import { useMissionsMapData } from '../../hooks/useMissionsMapData'
import { MissionDetailHeader } from '../../components/detail/MissionDetailHeader'
import { MissionInfoCard } from '../../components/detail/MissionInfoCard'
import { MissionProgressCard } from '../../components/detail/MissionProgressCard'
import { MissionItemsList } from '../../components/detail/MissionItemsList'
import { MissionNotesCard } from '../../components/detail/MissionNotesCard'
import { MissionHistoryCard } from '../../components/detail/MissionHistoryCard'
import { MissionMapView } from '../../components/map/MissionMapView'

/** Empile en 1 colonne, carte remontée juste après l'en-tête (même convention que `MobileContractDetailPage.tsx`). */
export function MobileMissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: mission, isLoading } = useMission(id)
  const { data: mapPoints } = useMissionsMapData(id)

  if (isLoading || !mission || !id) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light p-4" />
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <MissionDetailHeader mission={mission} />
      <Card className="h-80 p-0">
        <MissionMapView points={mapPoints ?? []} className="h-full w-full rounded-card" />
      </Card>
      <MissionInfoCard mission={mission} />
      <MissionProgressCard mission={mission} />
      <MissionItemsList missionId={id} />
      <MissionNotesCard missionId={id} />
      <MissionHistoryCard missionId={id} />
    </div>
  )
}
