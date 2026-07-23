import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeClientsService from '../services/routeClients.service'
import { routeKeys } from './routeKeys'

export function useRemoveRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => routeClientsService.removeClientFromRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
      toast.success('Client retiré de la route.')
    },
    onError: () => toast.error('Impossible de retirer le client.'),
  })
}
