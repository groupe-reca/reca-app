import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { EquipmentFormModal } from '../../components/EquipmentFormModal'
import { EquipmentDetailHeader } from '../../components/detail/EquipmentDetailHeader'
import { EquipmentInfoStrip } from '../../components/detail/EquipmentInfoStrip'
import { EquipmentMaintenanceCard } from '../../components/detail/EquipmentMaintenanceCard'
import { useDeleteEquipment } from '../../hooks/useDeleteEquipment'
import { useEquipment } from '../../hooks/useEquipment'
import { useUpdateEquipmentStatus } from '../../hooks/useUpdateEquipmentStatus'

export function MobileEquipmentDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: equipment, isLoading, isError } = useEquipment(id)
  const updateStatus = useUpdateEquipmentStatus(id)
  const deleteEquipment = useDeleteEquipment()
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    if (!equipment) return
    if (!window.confirm(`Supprimer l’équipement ${equipment.numero} ?`)) return
    deleteEquipment.mutate(equipment.id, { onSuccess: () => navigate('/equipment') })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={equipment}
        errorLabel="Impossible de charger cet équipement."
      >
        {(equipmentData) => (
          <>
            <EquipmentDetailHeader
              equipment={equipmentData}
              onEdit={() => setEditOpen(true)}
              onChangeStatus={(status) => updateStatus.mutate(status)}
              onDelete={handleDelete}
            />
            <EquipmentInfoStrip equipment={equipmentData} />
            <EquipmentMaintenanceCard equipment={equipmentData} />
            <EquipmentFormModal open={editOpen} onClose={() => setEditOpen(false)} equipment={equipmentData} />
          </>
        )}
      </QueryState>
    </div>
  )
}
