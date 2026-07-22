import { z } from 'zod'

export const interventionSchema = z.object({
  date: z.string().min(1, 'La date est requise'),
  heurePrevue: z.string().optional(),
  routeId: z.string().min(1, 'La route est requise'),
  employeeId: z.string().min(1, "L'employé est requis"),
  equipmentId: z.string().optional(),
  commentaires: z.string().optional(),
})

export type InterventionFormValues = z.infer<typeof interventionSchema>
