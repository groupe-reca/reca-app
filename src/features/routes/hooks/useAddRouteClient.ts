import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeClientsService from '../services/routeClients.service'
import { routeKeys } from './routeKeys'

export function useAddRouteClient(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientId: string) => routeClientsService.addClientToRoute(routeId, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.clients(routeId) })
      toast.success('Client ajouté à la route.')
    },
    onError: () => toast.error('Impossible d’ajouter le client.'),
  })
}
