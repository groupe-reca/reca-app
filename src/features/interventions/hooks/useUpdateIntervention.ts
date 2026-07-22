import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import type { InterventionFormValues } from '../schemas/intervention.schema'
import { interventionKeys } from './interventionKeys'

export function useUpdateIntervention(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: InterventionFormValues) => interventionsService.updateIntervention(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.all })
      toast.success('Intervention mise à jour.')
    },
    onError: () => toast.error("Impossible de mettre à jour l'intervention."),
  })
}
