export const interventionKeys = {
  all: ['interventions'] as const,
  list: () => [...interventionKeys.all, 'list'] as const,
  detail: (id: string) => [...interventionKeys.all, 'detail', id] as const,
  items: (interventionId: string) => [...interventionKeys.all, 'items', interventionId] as const,
  notes: (interventionId: string) => [...interventionKeys.all, 'notes', interventionId] as const,
  events: (interventionId: string) => [...interventionKeys.all, 'events', interventionId] as const,
}
