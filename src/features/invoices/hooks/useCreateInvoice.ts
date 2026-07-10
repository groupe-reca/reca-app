import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as invoicesService from '../services/invoices.service'
import type { InvoiceFormValues } from '../schemas/invoice.schema'
import { invoiceKeys } from './invoiceKeys'

export function useCreateInvoice(clientId: string, contratId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: InvoiceFormValues) => invoicesService.createInvoice(values, clientId, contratId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Facture créée.')
    },
    onError: () => toast.error('Impossible de créer la facture.'),
  })
}
