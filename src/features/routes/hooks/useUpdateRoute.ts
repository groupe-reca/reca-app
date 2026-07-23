import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'
import type { RouteFormValues } from '../schemas/route.schema'

export function useUpdateRoute(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: RouteFormValues) => routesService.updateRoute(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Route mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la route.'),
  })
}
