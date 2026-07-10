import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientsService from '../services/clients.service'
import type { ClientFormValues } from '../schemas/client.schema'
import { clientKeys } from './clientKeys'

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ClientFormValues) => clientsService.updateClient(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      toast.success('Client mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le client.'),
  })
}
