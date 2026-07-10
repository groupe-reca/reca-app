import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import { invoiceKeys } from '@/features/invoices/hooks/invoiceKeys'
import * as paymentsService from '../services/payments.service'
import { paymentKeys } from './paymentKeys'

export function useDeletePayment(factureId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => paymentsService.softDeletePayment(id, factureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Paiement supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer le paiement.'),
  })
}
