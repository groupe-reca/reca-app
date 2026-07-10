import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as employeeEquipmentService from '../services/employeeEquipment.service'
import { employeeKeys } from './employeeKeys'

export function useUnassignEquipment(employeeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeEquipmentService.unassignEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.equipment(employeeId) })
      toast.success('Équipement retiré.')
    },
    onError: () => toast.error('Impossible de retirer l’équipement.'),
  })
}
