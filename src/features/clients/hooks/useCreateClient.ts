import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientsService from '../services/clients.service'
import { clientKeys } from './clientKeys'

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clientsService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all })
      toast.success('Client créé.')
    },
    onError: () => toast.error('Impossible de créer le client.'),
  })
}
