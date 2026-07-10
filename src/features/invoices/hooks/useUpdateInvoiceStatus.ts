import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as invoicesService from '../services/invoices.service'
import type { InvoiceStatus } from '../types/invoice.types'
import { invoiceKeys } from './invoiceKeys'

export function useUpdateInvoiceStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: InvoiceStatus) => invoicesService.updateInvoiceStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
