import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionNotesService from '../services/interventionNotes.service'
import { interventionKeys } from './interventionKeys'

export function useAddInterventionNote(interventionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => interventionNotesService.createInterventionNote(interventionId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.notes(interventionId) })
      toast.success('Note ajoutée.')
    },
    onError: () => toast.error("Impossible d'ajouter la note."),
  })
}
