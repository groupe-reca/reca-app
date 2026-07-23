import { z } from 'zod'

export const routeRenameSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
})

export type RouteRenameFormValues = z.infer<typeof routeRenameSchema>
