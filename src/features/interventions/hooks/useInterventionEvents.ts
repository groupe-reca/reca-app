import { useQuery } from '@tanstack/react-query'
import * as interventionEventsService from '../services/interventionEvents.service'
import { interventionKeys } from './interventionKeys'

export function useInterventionEvents(interventionId: string) {
  return useQuery({
    queryKey: interventionKeys.events(interventionId),
    queryFn: () => interventionEventsService.listInterventionEvents(interventionId),
    enabled: Boolean(interventionId),
  })
}
