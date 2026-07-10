import { useQuery } from '@tanstack/react-query'
import * as routesService from '../services/routes.service'
import { routeKeys } from './routeKeys'

export function useRoutes() {
  return useQuery({
    queryKey: routeKeys.list(),
    queryFn: routesService.listRoutes,
  })
}
