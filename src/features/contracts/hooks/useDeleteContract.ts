import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

export function useDeleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: contractsService.softDeleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Contrat supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer le contrat.'),
  })
}
