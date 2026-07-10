import { z } from 'zod'

const numericString = z
  .string()
  .min(1, 'Ce champ est requis')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Doit être un nombre positif')

export const invoiceSchema = z.object({
  date: z.string().min(1, 'La date est requise'),
  sousTotal: numericString,
  tps: numericString,
  tvq: numericString,
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>
