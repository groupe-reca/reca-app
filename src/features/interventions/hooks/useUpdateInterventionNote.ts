import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as interventionNotesService from '../services/interventionNotes.service'
import { interventionKeys } from './interventionKeys'

export function useUpdateInterventionNote(interventionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      interventionNotesService.updateInterventionNote(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: interventionKeys.notes(interventionId) })
      toast.success('Note mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la note.'),
  })
}
