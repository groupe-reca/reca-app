import { z } from 'zod'

const optionalCoordinate = z
  .string()
  .optional()
  .refine((value) => !value || !Number.isNaN(Number(value)), 'Doit être un nombre')

export const clientSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  entreprise: z.string().optional(),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.string().email('Courriel invalide')]).optional(),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  latitude: optionalCoordinate,
  longitude: optionalCoordinate,
  typeClient: z.string().optional(),
  notes: z.string().optional(),
})

export type ClientFormValues = z.infer<typeof clientSchema>
