import { useQuery } from '@tanstack/react-query'
import * as contractNotesService from '../services/contractNotes.service'
import { contractKeys } from './contractKeys'

export function useContractNotes(contractId: string) {
  return useQuery({
    queryKey: contractKeys.notes(contractId),
    queryFn: () => contractNotesService.listContractNotes(contractId),
    enabled: Boolean(contractId),
  })
}
