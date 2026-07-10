import { useQuery } from '@tanstack/react-query'
import * as paymentsService from '../services/payments.service'
import { paymentKeys } from './paymentKeys'

export function usePayments() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: paymentsService.listPayments,
  })
}
