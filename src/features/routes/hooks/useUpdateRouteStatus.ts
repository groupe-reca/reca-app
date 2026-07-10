import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routesService from '../services/routes.service'
import type { RouteStatus } from '../types/route.types'
import { routeKeys } from './routeKeys'

export function useUpdateRouteStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: RouteStatus) => routesService.updateRouteStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
