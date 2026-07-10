import { z } from 'zod'

const numericString = z
  .string()
  .min(1, 'Ce champ est requis')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Doit être un nombre positif')

export const quoteSchema = z.object({
  montant: numericString,
  taxes: numericString,
  expiration: z.string().optional(),
  notes: z.string().optional(),
})

export type QuoteFormValues = z.infer<typeof quoteSchema>
