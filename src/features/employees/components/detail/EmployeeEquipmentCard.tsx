import { useState } from 'react'
import { Plus, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { EquipmentStatusBadge } from '@/features/equipments/components/EquipmentStatusBadge'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useAssignEquipment } from '../../hooks/useAssignEquipment'
import { useEmployeeEquipment } from '../../hooks/useEmployeeEquipment'
import { useUnassignEquipment } from '../../hooks/useUnassignEquipment'

export function EmployeeEquipmentCard({ employeeId }: { employeeId: string }) {
  const { data: assignedEquipment } = useEmployeeEquipment(employeeId)
  const { data: allEquipment } = useEquipments()
  const assignEquipment = useAssignEquipment(employeeId)
  const unassignEquipment = useUnassignEquipment(employeeId)
  const [equipmentToAssign, setEquipmentToAssign] = useState('')

  const assignedIds = new Set((assignedEquipment ?? []).map((item) => item.equipmentId))
  const availableToAssign = (allEquipment ?? []).filter((item) => !assignedIds.has(item.id))

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Équipements assignés</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select
            label="Assigner un équipement"
            icon={Truck}
            value={equipmentToAssign}
            onChange={(event) => setEquipmentToAssign(event.target.value)}
          >
            <option value="">Sélectionner un équipement</option>
            {availableToAssign.map((item) => (
              <option key={item.id} value={item.id}>
                {item.numero} — {item.nom}
              </option>
            ))}
          </Select>
        </div>
        <Button
          variant="secondary"
          fullWidth
          className="sm:w-auto"
          isLoading={assignEquipment.isPending}
          disabled={!equipmentToAssign}
          onClick={() => assignEquipment.mutate(equipmentToAssign, { onSuccess: () => setEquipmentToAssign('') })}
        >
          <Plus className="size-4" aria-hidden="true" />
          Assigner
        </Button>
      </div>
      {assignedEquipment && assignedEquipment.length > 0 ? (
        <div className="flex flex-col gap-2">
          {assignedEquipment.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3"
            >
              <div className="text-body text-reca-black">
                <span className="font-medium">{item.numero}</span>
                <span className="text-reca-gray-medium"> — {item.nom}</span>
              </div>
              <div className="flex items-center gap-3">
                <EquipmentStatusBadge status={item.statut} />
                <Button variant="ghost" onClick={() => unassignEquipment.mutate(item.id)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun équipement assigné.</p>
      )}
    </Card>
  )
}
