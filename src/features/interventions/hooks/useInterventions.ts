import { useQuery } from '@tanstack/react-query'
import * as interventionsService from '../services/interventions.service'
import { interventionKeys } from './interventionKeys'

export function useInterventions() {
  return useQuery({
    queryKey: interventionKeys.list(),
    queryFn: interventionsService.listInterventions,
  })
}
