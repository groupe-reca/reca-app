import { Card } from '@/components/ui/Card'
import type { MissionSummary } from '../../types/mission.types'

export function MissionProgressCard({ mission }: { mission: MissionSummary }) {
  const percent = mission.itemCount > 0 ? Math.round((mission.itemsTerminee / mission.itemCount) * 100) : 0

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Progression</h2>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-body">
        <span className="font-semibold text-reca-black">{mission.itemCount} contrats</span>
        <span className="text-reca-gray-medium">{mission.itemsTerminee} terminés</span>
        <span className="text-reca-gray-medium">{mission.itemsEnCours} en cours</span>
        <span className="text-reca-gray-medium">{mission.itemsAReprendre} à reprendre</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-reca-gray-light">
        <div className="h-full rounded-full bg-reca-red transition-all" style={{ width: `${percent}%` }} />
      </div>
    </Card>
  )
}
