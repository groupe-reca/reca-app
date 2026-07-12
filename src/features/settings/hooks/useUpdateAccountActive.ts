import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as accountsService from '../services/accounts.service'
import { settingsKeys } from './settingsKeys'

export function useUpdateAccountActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, actif }: { id: string; actif: boolean }) => accountsService.updateAccountActive(id, actif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.accounts })
      toast.success('Compte mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le compte.'),
  })
}
