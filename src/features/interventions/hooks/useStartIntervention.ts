import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import * as interventionEventsService from '../services/interventionEvents.service'
import { interventionKeys } from './interventionKeys'

export function useStartIntervention(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const intervention = await interventionsService.startIntervention(id)
      await interventionEventsService.createInterventionEvent(id, 'debut')
      return intervention
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.events(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.list() })
      toast.success('Intervention démarrée.')
    },
    onError: () => toast.error("Impossible de démarrer l'intervention."),
  })
}
