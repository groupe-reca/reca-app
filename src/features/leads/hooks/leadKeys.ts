export const leadKeys = {
  all: ['leads'] as const,
  list: () => [...leadKeys.all, 'list'] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
}
