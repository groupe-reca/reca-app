import { z } from 'zod'

const optionalNumericString = z
  .string()
  .optional()
  .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0), 'Doit être un nombre positif')

export const contractSchema = z.object({
  type: z.string().optional(),
  saison: z.string().optional(),
  prix: optionalNumericString,
  dateSignature: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  renouvellement: z.boolean().optional(),
  notes: z.string().optional(),
})

export type ContractFormValues = z.infer<typeof contractSchema>
