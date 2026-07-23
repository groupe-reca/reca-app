import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionItemsService from '../services/interventionItems.service'
import type { InterventionItemUpdateFormValues } from '../schemas/interventionItemUpdate.schema'
import { interventionKeys } from './interventionKeys'

export function useUpdateInterventionItemStatus(interventionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: InterventionItemUpdateFormValues }) =>
      interventionItemsService.updateInterventionItemStatus(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.items(interventionId) })
      queryClient.invalidateQueries({ queryKey: interventionKeys.list() })
      toast.success('Statut de la résidence mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut de la résidence.'),
  })
}
