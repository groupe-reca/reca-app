import { useQuery } from '@tanstack/react-query'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'

export function useRoute(id: string | undefined) {
  return useQuery({
    queryKey: routeKeys.detail(id ?? ''),
    queryFn: () => routesService.getRoute(id as string),
    enabled: Boolean(id),
  })
}
