import { useQuery } from '@tanstack/react-query'
import * as clientNotesService from '../services/clientNotes.service'
import { clientKeys } from './clientKeys'

export function useClientNotes(clientId: string) {
  return useQuery({
    queryKey: clientKeys.notes(clientId),
    queryFn: () => clientNotesService.listClientNotes(clientId),
    enabled: Boolean(clientId),
  })
}
