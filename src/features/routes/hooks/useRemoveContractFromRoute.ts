import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeContractsService from '../services/routeContracts.service'
import { routeKeys } from './routeKeys'

export function useRemoveContractFromRoute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: routeContractsService.removeContractFromRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Contrat retiré de la route.')
    },
    onError: () => toast.error('Impossible de retirer le contrat.'),
  })
}
