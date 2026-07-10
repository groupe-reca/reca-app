import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import type { ContractFormValues } from '../schemas/contract.schema'
import { contractKeys } from './contractKeys'

export function useUpdateContract(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ContractFormValues) => contractsService.updateContract(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Contrat mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le contrat.'),
  })
}
