import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeContractsService from '../services/routeContracts.service'
import { routeKeys } from './routeKeys'

/** Pas de toast succès (silencieux) pour éviter le spam sur des clics Monter/Descendre répétés. */
export function useReorderRouteContract(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: 'up' | 'down' }) =>
      routeContractsService.reorderRouteContract(id, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.contracts(routeId) })
    },
    onError: () => toast.error('Impossible de réordonner le contrat.'),
  })
}
