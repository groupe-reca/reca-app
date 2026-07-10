import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as equipmentsService from '../services/equipments.service'
import type { EquipmentFormValues } from '../schemas/equipment.schema'
import { equipmentKeys } from './equipmentKeys'

export function useUpdateEquipment(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: EquipmentFormValues) => equipmentsService.updateEquipment(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      toast.success('Équipement mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour l’équipement.'),
  })
}
