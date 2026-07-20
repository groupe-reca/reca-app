import { useQuery } from '@tanstack/react-query'
import * as paymentsService from '../services/payments.service'
import { paymentKeys } from './paymentKeys'

export function usePaymentsByContract(contratId: string) {
  return useQuery({
    queryKey: paymentKeys.byContract(contratId),
    queryFn: () => paymentsService.listPaymentsByContract(contratId),
    enabled: Boolean(contratId),
  })
}
