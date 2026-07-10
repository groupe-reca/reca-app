import { useQuery } from '@tanstack/react-query'
import * as paymentsService from '../services/payments.service'
import { paymentKeys } from './paymentKeys'

export function useInvoicePayments(factureId: string) {
  return useQuery({
    queryKey: paymentKeys.byInvoice(factureId),
    queryFn: () => paymentsService.listPaymentsByInvoice(factureId),
    enabled: Boolean(factureId),
  })
}
