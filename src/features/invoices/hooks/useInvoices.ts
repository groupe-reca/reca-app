import { useQuery } from '@tanstack/react-query'
import * as invoicesService from '../services/invoices.service'
import { invoiceKeys } from './invoiceKeys'

export function useInvoices() {
  return useQuery({
    queryKey: invoiceKeys.list(),
    queryFn: invoicesService.listInvoices,
  })
}
