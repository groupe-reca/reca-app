export const routeKeys = {
  all: ['routes'] as const,
  list: () => [...routeKeys.all, 'list'] as const,
  detail: (id: string) => [...routeKeys.all, 'detail', id] as const,
  clients: (routeId: string) => [...routeKeys.all, 'clients', routeId] as const,
  assignments: (routeId: string) => [...routeKeys.all, 'assignments', routeId] as const,
}
