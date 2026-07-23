import { useQuery } from '@tanstack/react-query'
import * as routesMapService from '../services/routesMap.service'
import { routeKeys } from './routeKeys'

export function useRoutesMapData() {
  return useQuery({
    queryKey: routeKeys.mapData(),
    queryFn: routesMapService.getRoutesMapData,
  })
}
