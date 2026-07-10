import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import type { Role } from '@/features/auth/types/auth.types'
import * as employeeAccountService from '../services/employeeAccount.service'
import { employeeKeys } from './employeeKeys'

export function usePromoteEmployeeAccount(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (role: Role) => employeeAccountService.updateAccountRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.account(userId) })
      toast.success('Rôle du compte mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le rôle du compte.'),
  })
}
