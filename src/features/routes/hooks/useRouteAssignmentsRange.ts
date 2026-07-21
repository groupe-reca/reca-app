import { useQuery } from '@tanstack/react-query'
import * as routeAssignmentsService from '../services/routeAssignments.service'
import { routeKeys } from './routeKeys'

export function useRouteAssignmentsRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: routeKeys.assignmentsRange(startDate, endDate),
    queryFn: () => routeAssignmentsService.listAssignmentsInRange(startDate, endDate),
  })
}
