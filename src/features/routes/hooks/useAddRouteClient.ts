import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeClientsService from '../services/routeClients.service'
import { recalculateRouteMetrics } from '../services/routeMetrics.service'
import type { RouteMetricsResult } from '../services/routeMetrics.service'
import { handleRouteMetricsResult } from './routeMetricsFeedback'
import { routeKeys } from './routeKeys'

export function useAddRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clientId: string) => {
      await routeClientsService.addClientToRoute(routeId, clientId)
      // Un échec du recalcul ne doit jamais annuler l'ajout du client lui-même.
      return recalculateRouteMetrics(routeId).catch(
        (): RouteMetricsResult => ({ status: 'error', message: 'network' }),
      )
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
      handleRouteMetricsResult(queryClient, routeId, result)
      toast.success('Client ajouté à la route.')
    },
    onError: () => toast.error('Impossible d’ajouter le client.'),
  })
}
