import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as invoicesService from '../services/invoices.service'
import type { InvoiceFormValues } from '../schemas/invoice.schema'
import { invoiceKeys } from './invoiceKeys'

export function useUpdateInvoice(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: InvoiceFormValues) => invoicesService.updateInvoice(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Facture mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la facture.'),
  })
}
