import { useQuery } from '@tanstack/react-query'
import * as accountsService from '../services/accounts.service'
import { settingsKeys } from './settingsKeys'

export function useAccounts() {
  return useQuery({
    queryKey: settingsKeys.accounts,
    queryFn: accountsService.listAccounts,
  })
}
