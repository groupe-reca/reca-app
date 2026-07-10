import { useQuery } from '@tanstack/react-query'
import * as clientsService from '../services/clients.service'
import { clientKeys } from './clientKeys'

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientsService.getClient(id),
    enabled: Boolean(id),
  })
}
