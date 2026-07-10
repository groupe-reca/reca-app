import { z } from 'zod'

export const paymentSchema = z.object({
  montant: z
    .string()
    .min(1, 'Le montant est requis')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, 'Doit être un nombre positif'),
  methode: z.string().optional(),
  reference: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  notes: z.string().optional(),
})

export type PaymentFormValues = z.infer<typeof paymentSchema>
