export const invoiceKeys = {
  all: ['invoices'] as const,
  list: () => [...invoiceKeys.all, 'list'] as const,
  byClient: (clientId: string) => [...invoiceKeys.all, 'byClient', clientId] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
}
