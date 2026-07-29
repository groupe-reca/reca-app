import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EquipmentsListContent } from '../../components/EquipmentsListContent'
import { useEquipments } from '../../hooks/useEquipments'

export function DesktopEquipmentsListPage() {
  const navigate = useNavigate()
  const { data: equipments, isLoading, isError } = useEquipments()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Équipements</h1>
          <p className="text-body text-reca-gray-medium">Véhicules et machines de l’entreprise.</p>
        </div>
        <Button onClick={() => navigate('/equipment/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvel équipement
        </Button>
      </div>

      <EquipmentsListContent equipments={equipments} isLoading={isLoading} isError={isError} />
    </div>
  )
}
