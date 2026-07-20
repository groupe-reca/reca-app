import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractNotesService from '../services/contractNotes.service'
import { contractKeys } from './contractKeys'

export function useAddContractNote(contractId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => contractNotesService.createContractNote(contractId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.notes(contractId) })
      toast.success('Note ajoutée.')
    },
    onError: () => toast.error("Impossible d'ajouter la note."),
  })
}
