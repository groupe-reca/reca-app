import { useMemo } from 'react'
import { Ban, CheckCircle2, ClipboardList, Hourglass, PlayCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Intervention } from '../types/intervention.types'

type InterventionsStatsRowProps = {
  interventions: Intervention[]
}

export function InterventionsStatsRow({ interventions }: InterventionsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: interventions.length,
      enCours: interventions.filter((intervention) => intervention.statut === 'en_cours').length,
      terminees: interventions.filter(
        (intervention) => intervention.statut === 'terminee' || intervention.statut === 'terminee_avec_anomalies',
      ).length,
      planifiees: interventions.filter((intervention) => intervention.statut === 'planifiee').length,
      annulees: interventions.filter((intervention) => intervention.statut === 'annulee').length,
    }),
    [interventions],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={ClipboardList} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={PlayCircle} iconColor="orange" value={counts.enCours} label="En cours" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.terminees} label="Terminées" />
      <StatCard icon={Hourglass} iconColor="gray" value={counts.planifiees} label="Planifiées" />
      <StatCard icon={Ban} iconColor="red" value={counts.annulees} label="Annulées" />
    </div>
  )
}
