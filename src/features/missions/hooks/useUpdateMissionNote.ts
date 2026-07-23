import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as missionNotesService from '../services/missionNotes.service'
import { missionKeys } from './missionKeys'

export function useUpdateMissionNote(missionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      missionNotesService.updateMissionNote(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.notes(missionId) })
      toast.success('Note mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la note.'),
  })
}
