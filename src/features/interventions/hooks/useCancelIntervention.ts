import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import { interventionKeys } from './interventionKeys'

export function useCancelIntervention(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => interventionsService.cancelIntervention(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.all })
      toast.success('Intervention annulée.')
    },
    onError: () => toast.error("Impossible d'annuler l'intervention."),
  })
}
