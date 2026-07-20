import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import type { ContractRow } from '../types/contract.types'
import { contractKeys } from './contractKeys'

export type OperatorInfoPatch = Partial<
  Pick<ContractRow, 'obstacles_connus' | 'message_operateur' | 'consignes_speciales' | 'notes'>
>

export function useUpdateContractOperatorInfo(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patch: OperatorInfoPatch) => contractsService.updateContractOperatorInfo(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Information mise à jour.')
    },
    onError: () => toast.error("Impossible de mettre à jour l'information."),
  })
}
