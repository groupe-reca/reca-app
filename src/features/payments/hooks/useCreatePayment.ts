import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import { invoiceKeys } from '@/features/invoices/hooks/invoiceKeys'
import * as paymentsService from '../services/payments.service'
import type { PaymentFormValues } from '../schemas/payment.schema'
import { paymentKeys } from './paymentKeys'

export function useCreatePayment(factureId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: PaymentFormValues) => paymentsService.createPayment(values, factureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Paiement enregistré.')
    },
    onError: () => toast.error('Impossible d’enregistrer le paiement.'),
  })
}
