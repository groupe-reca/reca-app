import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as missionNotesService from '../services/missionNotes.service'
import { missionKeys } from './missionKeys'

export function useAddMissionNote(missionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => missionNotesService.createMissionNote(missionId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.notes(missionId) })
      toast.success('Note ajoutée.')
    },
    onError: () => toast.error("Impossible d'ajouter la note."),
  })
}
