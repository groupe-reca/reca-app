import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'
import type { RouteRenameFormValues } from '../schemas/routeRename.schema'

export function useRenameRoute(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: RouteRenameFormValues) => routesService.renameRoute(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Route renommée.')
    },
    onError: () => toast.error('Impossible de renommer la route.'),
  })
}
