import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientsService from '../services/clients.service'
import { clientKeys } from './clientKeys'

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clientsService.softDeleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      toast.success('Client supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer le client.'),
  })
}
