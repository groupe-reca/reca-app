import type { QueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import type { RouteMetricsResult } from '../services/routeMetrics.service'
import { routeKeys } from './routeKeys'

/**
 * Invalide les requêtes affectées par un recalcul de distance/durée/tracé et
 * avertit l'utilisateur si le recalcul n'a pas pu aboutir — appelé par les 3 hooks
 * de mutation clients (ajout/retrait/réordonnancement), jamais directement.
 */
export function handleRouteMetricsResult(
  queryClient: QueryClient,
  routeId: string,
  result: RouteMetricsResult,
): void {
  queryClient.invalidateQueries({ queryKey: routeKeys.detail(routeId) })
  queryClient.invalidateQueries({ queryKey: routeKeys.mapData() })

  if (result.status === 'error' || (result.status === 'skipped' && result.reason !== 'not_configured')) {
    toast.error('Distance/durée non recalculées automatiquement pour cette route.')
  }
}
