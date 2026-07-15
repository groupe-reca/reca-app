import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractsService from '../services/contracts.service'
import type { ContractDraftFormValues } from '../schemas/contractCreation.schema'
import { contractKeys } from './contractKeys'

/** "Enregistrer le brouillon" — disponible dès l'étape 1, aucune facture générée. */
export function useSaveContractDraft(contractId: string, clientId: string, clientTypeLabel: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ContractDraftFormValues) =>
      contractsService.saveContractDraft(contractId, values, clientId, clientTypeLabel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      toast.success('Brouillon enregistré.')
    },
    onError: () => toast.error("Impossible d'enregistrer le brouillon."),
  })
}
