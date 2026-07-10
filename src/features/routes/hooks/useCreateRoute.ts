import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'

export function useCreateRoute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: routesService.createRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Route créée.')
    },
    onError: () => toast.error('Impossible de créer la route.'),
  })
}
