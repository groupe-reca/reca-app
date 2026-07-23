import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as routeClientsService from '../services/routeClients.service'
import { routeKeys } from './routeKeys'

type SwapArgs = { firstId: string; firstOrdre: number; secondId: string; secondOrdre: number }

export function useReorderRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ firstId, firstOrdre, secondId, secondOrdre }: SwapArgs) =>
      routeClientsService.swapClientOrder(firstId, firstOrdre, secondId, secondOrdre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
    },
  })
}
