import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientNotesService from '../services/clientNotes.service'
import { clientKeys } from './clientKeys'

export function useAddClientNote(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => clientNotesService.createClientNote(clientId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.notes(clientId) })
      toast.success('Note ajoutée.')
    },
    onError: () => toast.error("Impossible d'ajouter la note."),
  })
}
