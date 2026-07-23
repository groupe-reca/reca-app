import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as missionNotesService from '../services/missionNotes.service'
import { missionKeys } from './missionKeys'

export function useDeleteMissionNote(missionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => missionNotesService.softDeleteMissionNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.notes(missionId) })
      toast.success('Note supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la note.'),
  })
}
