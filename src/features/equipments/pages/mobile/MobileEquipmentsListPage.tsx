import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileEquipmentLayout } from '../../components/mobile/MobileEquipmentLayout'
import { EquipmentsListContent } from '../../components/EquipmentsListContent'
import { useEquipments } from '../../hooks/useEquipments'

export function MobileEquipmentsListPage() {
  const navigate = useNavigate()
  const { data: equipments, isLoading, isError } = useEquipments()

  return (
    <MobileEquipmentLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/equipment/new')}
          aria-label="Nouvel équipement"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <EquipmentsListContent equipments={equipments} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileEquipmentLayout>
  )
}
