export const clientKeys = {
  all: ['clients'] as const,
  list: () => [...clientKeys.all, 'list'] as const,
  detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
  notes: (clientId: string) => [...clientKeys.all, 'notes', clientId] as const,
}
