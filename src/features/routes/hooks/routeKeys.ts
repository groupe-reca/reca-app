export const routeKeys = {
  all: ['routes'] as const,
  list: () => [...routeKeys.all, 'list'] as const,
  detail: (id: string) => [...routeKeys.all, 'detail', id] as const,
  contracts: (routeId: string) => [...routeKeys.all, 'contracts', routeId] as const,
  mapData: () => [...routeKeys.all, 'map'] as const,
  unassignedContracts: (season: string | null) => [...routeKeys.all, 'unassigned', season] as const,
}
