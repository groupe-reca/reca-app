import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as employeeEquipmentService from '../services/employeeEquipment.service'
import { employeeKeys } from './employeeKeys'

export function useAssignEquipment(employeeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (equipmentId: string) => employeeEquipmentService.assignEquipment(employeeId, equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.equipment(employeeId) })
      toast.success('Équipement assigné.')
    },
    onError: () => toast.error('Impossible d’assigner l’équipement.'),
  })
}
