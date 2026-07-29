import { useMemo } from 'react'
import { FileText, MapPin, Truck, User } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import type { RouteSummary } from '../types/route.types'

type RoutesStatsRowProps = {
  routes: RouteSummary[]
}

/**
 * Pas d'axe de statut ici : les Routes n'ont aucun champ de statut réel (juste nom/couleur/opérateur/équipement) —
 * les 4 cartes restent des comptages honnêtes sur des données existantes, pas une catégorie inventée.
 * Masqué entièrement en mobile (module sans split Desktop/Mobile, contrairement aux autres modules qui
 * gèrent ça via `showStats` sur la page liste) — décision utilisateur, même traitement que les 7 autres modules.
 */
export function RoutesStatsRow({ routes }: RoutesStatsRowProps) {
  const tier = useDeviceTier()

  const counts = useMemo(
    () => ({
      total: routes.length,
      avecOperateur: routes.filter((route) => route.operatorId).length,
      avecEquipement: routes.filter((route) => route.equipmentId).length,
      totalContrats: routes.reduce((sum, route) => sum + route.contractCount, 0),
    }),
    [routes],
  )

  if (tier === 'mobile') return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={MapPin} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={User} iconColor="purple" value={counts.avecOperateur} label="Avec opérateur" />
      <StatCard icon={Truck} iconColor="orange" value={counts.avecEquipement} label="Avec équipement" />
      <StatCard icon={FileText} iconColor="green" value={counts.totalContrats} label="Contrats assignés" />
    </div>
  )
}
