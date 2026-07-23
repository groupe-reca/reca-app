import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionsService from '../services/interventions.service'
import * as interventionEventsService from '../services/interventionEvents.service'
import { summarizeItems } from '../services/interventionMetrics.service'
import type { InterventionItem } from '../types/interventionItem.types'
import { interventionKeys } from './interventionKeys'

/**
 * "Forcer la fermeture" — le gate de `useCloseIntervention` n'existe pas ici (contourne
 * volontairement la règle métier). Le gate d'accès reste purement UI (bouton rendu
 * seulement si `session.user.role === 'administrateur'`, cohérent avec la policy RLS
 * d'écriture ouverte à tout authentifié sur `interventions`) — aucun check de rôle dans ce
 * hook.
 */
export function useForceCloseIntervention(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const items = queryClient.getQueryData<InterventionItem[]>(interventionKeys.items(id)) ?? []
      const { total, completed } = summarizeItems(items)
      const intervention = await interventionsService.forceCloseIntervention(id)
      await interventionEventsService.createInterventionEvent(id, 'fermee', { itemsRestants: total - completed })
      return intervention
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.events(id) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.list() })
      toast.success('Fermeture forcée — intervention marquée "Terminée avec anomalies".')
    },
    onError: () => toast.error('Impossible de forcer la fermeture.'),
  })
}
