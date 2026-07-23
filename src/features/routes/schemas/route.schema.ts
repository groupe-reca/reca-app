import { z } from 'zod'

export const routeSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
  operatorId: z.string().min(1, "L'opérateur est requis"),
  equipmentId: z.string().min(1, "L'équipement est requis"),
})

export type RouteFormValues = z.infer<typeof routeSchema>
