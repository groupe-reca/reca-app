import { useQuery } from '@tanstack/react-query'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

export function useContract(id: string) {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractsService.getContract(id),
    enabled: Boolean(id),
  })
}
