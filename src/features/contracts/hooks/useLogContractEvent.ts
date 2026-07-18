import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as contractEventsService from '../services/contractEvents.service'
import type { ContractEventPayload, ContractEventType } from '../types/contractEvent.types'
import { contractKeys } from './contractKeys'

/**
 * Journal best-effort : appelé en plus de l'action principale (déjà son propre
 * toast succès/erreur côté appelant), jamais bloquant pour elle — une erreur de
 * journalisation ne doit pas empêcher/masquer le résultat de l'action réelle.
 */
export function useLogContractEvent(contractId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, payload }: { type: ContractEventType; payload?: ContractEventPayload }) =>
      contractEventsService.createContractEvent(contractId, type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.events(contractId) })
    },
  })
}
