import { useQuery } from '@tanstack/react-query'
import * as routeAssignmentsService from '../services/routeAssignments.service'
import { routeKeys } from './routeKeys'

export function useRouteAssignments(routeId: string) {
  return useQuery({
    queryKey: routeKeys.assignments(routeId),
    queryFn: () => routeAssignmentsService.listAssignments(routeId),
    enabled: Boolean(routeId),
  })
}
