import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as routeClientsService from '../services/routeClients.service'
import { recalculateRouteMetrics } from '../services/routeMetrics.service'
import type { RouteMetricsResult } from '../services/routeMetrics.service'
import { handleRouteMetricsResult } from './routeMetricsFeedback'
import { routeKeys } from './routeKeys'

type SwapArgs = { firstId: string; firstOrdre: number; secondId: string; secondOrdre: number }

export function useReorderRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ firstId, firstOrdre, secondId, secondOrdre }: SwapArgs) => {
      await routeClientsService.swapClientOrder(firstId, firstOrdre, secondId, secondOrdre)
      return recalculateRouteMetrics(routeId).catch(
        (): RouteMetricsResult => ({ status: 'error', message: 'network' }),
      )
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
      handleRouteMetricsResult(queryClient, routeId, result)
    },
  })
}
