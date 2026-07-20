import { useQuery } from '@tanstack/react-query'
import * as contractEventsService from '../services/contractEvents.service'
import { contractKeys } from './contractKeys'

export function useContractEvents(contractId: string) {
  return useQuery({
    queryKey: contractKeys.events(contractId),
    queryFn: () => contractEventsService.listContractEvents(contractId),
    enabled: Boolean(contractId),
  })
}
