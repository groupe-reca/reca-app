import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as equipmentsService from '../services/equipments.service'
import type { EquipmentStatus } from '../types/equipment.types'
import { equipmentKeys } from './equipmentKeys'

export function useUpdateEquipmentStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: EquipmentStatus) => equipmentsService.updateEquipmentStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
