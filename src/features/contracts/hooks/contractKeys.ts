export const contractKeys = {
  all: ['contracts'] as const,
  list: () => [...contractKeys.all, 'list'] as const,
  byClient: (clientId: string) => [...contractKeys.all, 'byClient', clientId] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
}
