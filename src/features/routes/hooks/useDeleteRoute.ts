import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'

export function useDeleteRoute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: routesService.softDeleteRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Route supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la route.'),
  })
}
