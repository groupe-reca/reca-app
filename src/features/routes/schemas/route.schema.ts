import { z } from 'zod'

const optionalNumericString = z
  .string()
  .optional()
  .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0), 'Doit être un nombre positif')

export const routeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  secteur: z.string().optional(),
  description: z.string().optional(),
  dureeEstimee: z.string().optional(),
  distance: optionalNumericString,
  couleur: z.string().optional(),
})

export type RouteFormValues = z.infer<typeof routeSchema>
