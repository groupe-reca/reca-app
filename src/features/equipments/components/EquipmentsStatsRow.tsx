import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, Truck, Wrench } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Equipment } from '../types/equipment.types'

type EquipmentsStatsRowProps = {
  equipments: Equipment[]
}

export function EquipmentsStatsRow({ equipments }: EquipmentsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: equipments.length,
      disponibles: equipments.filter((equipment) => equipment.statut === 'disponible').length,
      enOperation: equipments.filter((equipment) => equipment.statut === 'en_operation').length,
      entretien: equipments.filter((equipment) => equipment.statut === 'entretien').length,
      brises: equipments.filter((equipment) => equipment.statut === 'brise').length,
    }),
    [equipments],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={Truck} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.disponibles} label="Disponibles" />
      <StatCard icon={Truck} iconColor="purple" value={counts.enOperation} label="En opération" />
      <StatCard icon={Wrench} iconColor="orange" value={counts.entretien} label="Entretien" />
      <StatCard icon={AlertTriangle} iconColor="red" value={counts.brises} label="Brisés" />
    </div>
  )
}
