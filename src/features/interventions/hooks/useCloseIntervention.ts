import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import * as interventionEventsService from '../services/interventionEvents.service'
import { summarizeItems } from '../services/interventionMetrics.service'
import type { InterventionItem } from '../types/interventionItem.types'
import { interventionKeys } from './interventionKeys'

/** Rejetée par la mutation quand des résidences restent incomplètes — message exact du brief. */
export class InterventionCloseBlockedError extends Error {
  incompleteCount: number

  constructor(incompleteCount: number) {
    super(`Impossible de fermer. Il reste ${incompleteCount} résidences à compléter.`)
    this.name = 'InterventionCloseBlockedError'
    this.incompleteCount = incompleteCount
  }
}

/**
 * Le gate de fermeture (toutes les résidences doivent être Terminée) est vérifié ICI, avant
 * tout appel réseau — défense en profondeur en plus du check déjà fait côté header (bouton
 * "Fermer" masqué/désactivé quand des items restent incomplets). Lit les items depuis le
 * cache TanStack Query déjà chargé par la page détail (pas de refetch dédié).
 */
export function useCloseIntervention(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const items = queryClient.getQueryData<InterventionItem[]>(interventionKeys.items(id)) ?? []
      const { total, completed } = summarizeItems(items)
      const incompleteCount = total - completed
      if (incompleteCount > 0) {
        throw new InterventionCloseBlockedError(incompleteCount)
      }
      const intervention = await interventionsService.closeIntervention(id)
      await interventionEventsService.createInterventionEvent(id, 'terminee')
      return intervention
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.events(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.list() })
      toast.success('Intervention fermée.')
    },
    onError: (error) => {
      if (error instanceof InterventionCloseBlockedError) {
        toast.error(error.message)
        return
      }
      toast.error("Impossible de fermer l'intervention.")
    },
  })
}
