import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientNotesService from '../services/clientNotes.service'
import { clientKeys } from './clientKeys'

export function useDeleteClientNote(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientNotesService.softDeleteClientNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.notes(clientId) })
      toast.success('Note supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la note.'),
  })
}
