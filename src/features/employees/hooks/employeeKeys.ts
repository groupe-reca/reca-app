export const employeeKeys = {
  all: ['employees'] as const,
  list: () => [...employeeKeys.all, 'list'] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
  equipment: (employeeId: string) => [...employeeKeys.all, 'equipment', employeeId] as const,
  account: (userId: string) => [...employeeKeys.all, 'account', userId] as const,
}
