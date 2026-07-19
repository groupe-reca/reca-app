import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as clientNotesService from '../services/clientNotes.service'
import { clientKeys } from './clientKeys'

export function useUpdateClientNote(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => clientNotesService.updateClientNote(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.notes(clientId) })
      toast.success('Note mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la note.'),
  })
}
