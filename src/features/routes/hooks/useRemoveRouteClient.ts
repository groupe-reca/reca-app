import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeClientsService from '../services/routeClients.service'
import { recalculateRouteMetrics } from '../services/routeMetrics.service'
import type { RouteMetricsResult } from '../services/routeMetrics.service'
import { handleRouteMetricsResult } from './routeMetricsFeedback'
import { routeKeys } from './routeKeys'

export function useRemoveRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await routeClientsService.removeClientFromRoute(id)
      return recalculateRouteMetrics(routeId).catch(
        (): RouteMetricsResult => ({ status: 'error', message: 'network' }),
      )
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
      handleRouteMetricsResult(queryClient, routeId, result)
      toast.success('Client retiré de la route.')
    },
    onError: () => toast.error('Impossible de retirer le client.'),
  })
}
