import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import type { Role } from '@/features/auth/types/auth.types'
import * as accountsService from '../services/accounts.service'
import { settingsKeys } from './settingsKeys'

export function useUpdateAccountRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => accountsService.updateAccountRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.accounts })
      toast.success('Rôle mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le rôle.'),
  })
}
