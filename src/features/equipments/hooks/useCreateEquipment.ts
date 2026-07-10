import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as equipmentsService from '../services/equipments.service'
import { equipmentKeys } from './equipmentKeys'

export function useCreateEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentsService.createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      toast.success('Équipement créé.')
    },
    onError: () => toast.error('Impossible de créer l’équipement.'),
  })
}
