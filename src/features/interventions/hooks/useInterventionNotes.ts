import { useQuery } from '@tanstack/react-query'
import * as interventionNotesService from '../services/interventionNotes.service'
import { interventionKeys } from './interventionKeys'

export function useInterventionNotes(interventionId: string) {
  return useQuery({
    queryKey: interventionKeys.notes(interventionId),
    queryFn: () => interventionNotesService.listInterventionNotes(interventionId),
    enabled: Boolean(interventionId),
  })
}
