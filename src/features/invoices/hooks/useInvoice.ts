import { useQuery } from '@tanstack/react-query'
import * as invoicesService from '../services/invoices.service'
import { invoiceKeys } from './invoiceKeys'

export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoicesService.getInvoice(id),
    enabled: Boolean(id),
  })
}
