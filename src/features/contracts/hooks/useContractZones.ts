import { useQuery } from '@tanstack/react-query'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

export function useContractZones(contractId: string) {
  return useQuery({
    queryKey: contractKeys.zones(contractId),
    queryFn: () => contractsService.listContractZones(contractId),
    enabled: Boolean(contractId),
  })
}
