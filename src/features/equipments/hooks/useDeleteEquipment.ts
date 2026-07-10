import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as equipmentsService from '../services/equipments.service'
import { equipmentKeys } from './equipmentKeys'

export function useDeleteEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentsService.softDeleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.all })
      toast.success('Équipement supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer l’équipement.'),
  })
}
