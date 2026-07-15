import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import { invoiceKeys } from '@/features/invoices/hooks/invoiceKeys'
import * as contractsService from '../services/contracts.service'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'
import { contractKeys } from './contractKeys'

/** Finalisation ("Créer") uniquement — voir `useSaveContractDraft` pour le brouillon. */
export function useCreateContractWithInvoices(contractId: string, clientId: string, clientTypeLabel: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ContractCreationFormValues) =>
      contractsService.createContractWithZones(contractId, values, clientId, clientTypeLabel),
    onSuccess: ({ invoicesGenerated, invoicesTotal }) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      if (invoicesTotal > 0) queryClient.invalidateQueries({ queryKey: invoiceKeys.all })

      if (invoicesTotal === 0) toast.success('Contrat créé.')
      else if (invoicesGenerated === invoicesTotal) {
        toast.success(`Contrat créé et ${invoicesGenerated} facture(s) générée(s).`)
      } else {
        toast.error(`Contrat créé, mais seulement ${invoicesGenerated}/${invoicesTotal} facture(s) ont pu être générées.`)
      }
    },
    onError: () => toast.error('Impossible de créer le contrat.'),
  })
}
