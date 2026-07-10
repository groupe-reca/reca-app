import { useQuery } from '@tanstack/react-query'
import * as invoicesService from '../services/invoices.service'
import { invoiceKeys } from './invoiceKeys'

export function useClientInvoices(clientId: string) {
  return useQuery({
    queryKey: invoiceKeys.byClient(clientId),
    queryFn: () => invoicesService.listInvoicesByClient(clientId),
    enabled: Boolean(clientId),
  })
}
