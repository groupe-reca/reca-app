import { useQuery } from '@tanstack/react-query'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

export function useContracts() {
  return useQuery({
    queryKey: contractKeys.list(),
    queryFn: contractsService.listContracts,
  })
}
