export const quoteKeys = {
  all: ['quotes'] as const,
  list: () => [...quoteKeys.all, 'list'] as const,
  detail: (id: string) => [...quoteKeys.all, 'detail', id] as const,
}
