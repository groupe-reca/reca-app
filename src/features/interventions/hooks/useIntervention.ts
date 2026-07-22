import { useQuery } from '@tanstack/react-query'
import * as interventionsService from '../services/interventions.service'
import { interventionKeys } from './interventionKeys'

export function useIntervention(id: string) {
  return useQuery({
    queryKey: interventionKeys.detail(id),
    queryFn: () => interventionsService.getIntervention(id),
    enabled: Boolean(id),
  })
}
