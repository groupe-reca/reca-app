import { useQuery } from '@tanstack/react-query'
import * as routeContractsService from '../services/routeContracts.service'
import { routeKeys } from './routeKeys'

export function useRouteContracts(routeId: string | undefined) {
  return useQuery({
    queryKey: routeKeys.contracts(routeId ?? ''),
    queryFn: () => routeContractsService.listRouteContracts(routeId as string),
    enabled: Boolean(routeId),
  })
}
