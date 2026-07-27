import { useMemo } from 'react'
import { FileText, MapPin, Truck, User } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { RouteSummary } from '../types/route.types'

type RoutesStatsRowProps = {
  routes: RouteSummary[]
}

/** Pas d'axe de statut ici : les Routes n'ont aucun champ de statut réel (juste nom/couleur/opérateur/équipement) — les 4 cartes restent des comptages honnêtes sur des données existantes, pas une catégorie inventée. */
export function RoutesStatsRow({ routes }: RoutesStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: routes.length,
      avecOperateur: routes.filter((route) => route.operatorId).length,
      avecEquipement: routes.filter((route) => route.equipmentId).length,
      totalContrats: routes.reduce((sum, route) => sum + route.contractCount, 0),
    }),
    [routes],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={MapPin} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={User} iconColor="purple" value={counts.avecOperateur} label="Avec opérateur" />
      <StatCard icon={Truck} iconColor="orange" value={counts.avecEquipement} label="Avec équipement" />
      <StatCard icon={FileText} iconColor="green" value={counts.totalContrats} label="Contrats assignés" />
    </div>
  )
}
