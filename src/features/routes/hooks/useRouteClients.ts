import { useQuery } from '@tanstack/react-query'
import * as routeClientsService from '../services/routeClients.service'
import { routeKeys } from './routeKeys'

export function useRouteClients(routeId: string) {
  return useQuery({
    queryKey: routeKeys.clients(routeId),
    queryFn: () => routeClientsService.listRouteClients(routeId),
    enabled: Boolean(routeId),
  })
}
