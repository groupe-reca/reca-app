import { Truck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'
import type { Equipment } from '../types/equipment.types'

type EquipmentCardProps = {
  equipment: Equipment
  onClick: () => void
}

export function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  const marqueModele = [equipment.marque, equipment.modele].filter(Boolean).join(' ')

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <Truck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">{equipment.nom}</span>
            <EquipmentStatusBadge status={equipment.statut} />
          </div>
          <p className="truncate text-label text-reca-gray-medium">{equipment.categorie || marqueModele || '—'}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>{equipment.plaque ?? '—'}</span>
            <span>{equipment.numero}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
