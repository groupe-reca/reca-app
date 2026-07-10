import { useQuery } from '@tanstack/react-query'
import * as clientsService from '../services/clients.service'
import { clientKeys } from './clientKeys'

export function useClients() {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: clientsService.listClients,
  })
}
