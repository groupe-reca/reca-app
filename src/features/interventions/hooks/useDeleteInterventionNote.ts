import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionNotesService from '../services/interventionNotes.service'
import { interventionKeys } from './interventionKeys'

export function useDeleteInterventionNote(interventionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => interventionNotesService.softDeleteInterventionNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.notes(interventionId) })
      toast.success('Note supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la note.'),
  })
}
