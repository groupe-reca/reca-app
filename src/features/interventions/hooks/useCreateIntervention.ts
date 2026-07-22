import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import { interventionKeys } from './interventionKeys'

export function useCreateIntervention() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: interventionsService.createInterventionWithItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.all })
      toast.success('Intervention créée.')
    },
    onError: () => toast.error("Impossible de créer l'intervention."),
  })
}
