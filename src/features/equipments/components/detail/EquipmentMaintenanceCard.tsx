import { Card } from '@/components/ui/Card'
import type { Equipment } from '../../types/equipment.types'

export function EquipmentMaintenanceCard({ equipment }: { equipment: Equipment }) {
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-subtitle font-semibold text-reca-black">Entretien</h2>
      <p className="text-body text-reca-gray-medium">{equipment.entretien ?? 'Aucune information d’entretien.'}</p>
      <p className="text-body text-reca-gray-medium">Notes : {equipment.notes ?? '—'}</p>
    </Card>
  )
}
