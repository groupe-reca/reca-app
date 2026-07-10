export const equipmentKeys = {
  all: ['equipments'] as const,
  list: () => [...equipmentKeys.all, 'list'] as const,
  detail: (id: string) => [...equipmentKeys.all, 'detail', id] as const,
}
