export const paymentKeys = {
  all: ['payments'] as const,
  list: () => [...paymentKeys.all, 'list'] as const,
  byInvoice: (factureId: string) => [...paymentKeys.all, 'byInvoice', factureId] as const,
  byContract: (contratId: string) => [...paymentKeys.all, 'byContract', contratId] as const,
}
