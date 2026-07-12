import { useQuery } from '@tanstack/react-query'
import * as invoicesService from '../services/invoices.service'
import { invoiceKeys } from './invoiceKeys'

export function useContractInvoices(contratId: string) {
  return useQuery({
    queryKey: invoiceKeys.byContract(contratId),
    queryFn: () => invoicesService.listInvoicesByContract(contratId),
    enabled: Boolean(contratId),
  })
}
