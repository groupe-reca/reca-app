import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import type { ContractStatus } from '../types/contract.types'
import { contractKeys } from './contractKeys'

export function useUpdateContractStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: ContractStatus) => contractsService.updateContractStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
