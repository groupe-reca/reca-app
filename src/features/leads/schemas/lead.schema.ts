import { z } from 'zod'

export const leadSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.string().email('Courriel invalide')]).optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  typeService: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
