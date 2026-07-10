import { useQuery } from '@tanstack/react-query'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

export function useClientContracts(clientId: string) {
  return useQuery({
    queryKey: contractKeys.byClient(clientId),
    queryFn: () => contractsService.listContractsByClient(clientId),
    enabled: Boolean(clientId),
  })
}
