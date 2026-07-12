import { z } from 'zod'

const numericString = z
  .string()
  .min(1, 'Ce champ est requis')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Doit être un nombre positif')

export const settingsSchema = z.object({
  nom: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  courriel: z.union([z.literal(''), z.string().email('Courriel invalide')]).optional(),
  logo: z.string().optional(),
  tps: numericString,
  tvq: numericString,
  couleurPrimaire: z.string().optional(),
  couleurSecondaire: z.string().optional(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
