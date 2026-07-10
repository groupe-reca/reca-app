import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as invoicesService from '../services/invoices.service'
import { invoiceKeys } from './invoiceKeys'

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: invoicesService.softDeleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      toast.success('Facture supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la facture.'),
  })
}
