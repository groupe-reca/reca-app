import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { EquipmentForm } from '../components/EquipmentForm'
import { useCreateEquipment } from '../hooks/useCreateEquipment'

export function EquipmentCreatePage() {
  const navigate = useNavigate()
  const createEquipment = useCreateEquipment()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvel équipement</h1>
        <p className="text-body text-reca-gray-medium">Ajoutez un véhicule ou une machine à la flotte.</p>
      </div>

      <Card>
        <EquipmentForm
          isSubmitting={createEquipment.isPending}
          onSubmit={(values) =>
            createEquipment.mutate(values, { onSuccess: (created) => navigate(`/equipment/${created.id}`) })
          }
          onCancel={() => navigate('/equipment')}
        />
      </Card>
    </div>
  )
}
