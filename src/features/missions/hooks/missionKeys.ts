export const missionKeys = {
  all: ['missions'] as const,
  list: () => [...missionKeys.all, 'list'] as const,
  detail: (id: string) => [...missionKeys.all, 'detail', id] as const,
  items: (missionId: string) => [...missionKeys.all, 'items', missionId] as const,
  events: (missionId: string) => [...missionKeys.all, 'events', missionId] as const,
  notes: (missionId: string) => [...missionKeys.all, 'notes', missionId] as const,
  mapData: (missionId: string) => [...missionKeys.all, 'map', missionId] as const,
}
