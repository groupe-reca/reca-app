import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeContractsService from '../services/routeContracts.service'
import { routeKeys } from './routeKeys'

/** Partagé par l'assignation rapide, "Ajouter un contrat" et "Transférer". */
export function useAssignContractToRoute() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contractId, routeId }: { contractId: string; routeId: string }) =>
      routeContractsService.assignContractToRoute(contractId, routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all })
      toast.success('Contrat assigné à la route.')
    },
    onError: () => toast.error("Impossible d'assigner le contrat."),
  })
}
