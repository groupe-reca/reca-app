import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import type { ContractFormValues } from '../schemas/contract.schema'
import { contractKeys } from './contractKeys'

export function useCreateContract(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ContractFormValues) => contractsService.createContract(values, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Contrat créé.')
    },
    onError: () => toast.error('Impossible de créer le contrat.'),
  })
}
