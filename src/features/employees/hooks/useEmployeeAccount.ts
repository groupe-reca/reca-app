import { useQuery } from '@tanstack/react-query'
import * as employeeAccountService from '../services/employeeAccount.service'
import { employeeKeys } from './employeeKeys'

export function useEmployeeAccount(userId: string | null) {
  return useQuery({
    queryKey: employeeKeys.account(userId ?? ''),
    queryFn: () => employeeAccountService.getEmployeeAccount(userId as string),
    enabled: Boolean(userId),
  })
}
