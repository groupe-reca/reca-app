import { useMemo } from 'react'
import { AlertTriangle, Ban, CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { MISSION_STATUS_COLORS } from '../constants/missionStatusColors'
import type { MissionSummary } from '../types/mission.types'

type MissionsStatsRowProps = {
  missions: MissionSummary[]
}

export function MissionsStatsRow({ missions }: MissionsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: missions.length,
      planifiees: missions.filter((mission) => mission.statut === 'planifiee').length,
      enCours: missions.filter((mission) => mission.statut === 'en_cours').length,
      terminees: missions.filter((mission) => mission.statut === 'terminee').length,
      avecAnomalies: missions.filter((mission) => mission.statut === 'terminee_avec_anomalies').length,
      annulees: missions.filter((mission) => mission.statut === 'annulee').length,
    }),
    [missions],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard icon={CheckCircle2} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={Clock} iconColor={MISSION_STATUS_COLORS.planifiee} value={counts.planifiees} label="Planifiées" />
      <StatCard icon={PlayCircle} iconColor={MISSION_STATUS_COLORS.en_cours} value={counts.enCours} label="En cours" />
      <StatCard icon={CheckCircle2} iconColor={MISSION_STATUS_COLORS.terminee} value={counts.terminees} label="Terminées" />
      <StatCard
        icon={AlertTriangle}
        iconColor={MISSION_STATUS_COLORS.terminee_avec_anomalies}
        value={counts.avecAnomalies}
        label="Avec anomalies"
      />
      <StatCard icon={Ban} iconColor={MISSION_STATUS_COLORS.annulee} value={counts.annulees} label="Annulées" />
    </div>
  )
}
