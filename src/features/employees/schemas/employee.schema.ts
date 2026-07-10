import { z } from 'zod'

export const employeeSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.string().email('Courriel invalide')]).optional(),
  poste: z.string().optional(),
  role: z.string().optional(),
  dateEmbauche: z.string().optional(),
  actif: z.boolean().optional(),
  photo: z.string().optional(),
  notes: z.string().optional(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
