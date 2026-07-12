import { z } from 'zod'

const numericString = z
  .string()
  .min(1, 'Ce champ est requis')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Doit être un nombre positif')

const optionalNumericString = z
  .string()
  .optional()
  .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0), 'Doit être un nombre positif')

export const paymentScheduleEntrySchema = z.object({
  description: z.string().min(1, 'Description requise'),
  type: z.enum(['pourcentage', 'montant']),
  valeur: numericString,
  dateEcheance: z.string().min(1, 'Date requise'),
})

export const contractCreationSchema = z.object({
  type: z.string().optional(),
  saison: z.string().optional(),
  prix: optionalNumericString,
  dateSignature: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  renouvellement: z.boolean().optional(),
  notes: z.string().optional(),
  zoneDesservie: z.string().min(1, 'Requis'),
  superficie: optionalNumericString,
  exclusions: z.string().min(1, 'Requis'),
  seuilDeclenchementCm: numericString,
  heurePremierPassage: z.string().min(1, 'Requis'),
  nettoyageFinal: z.string().min(1, 'Requis'),
  distanceSecuriteCm: numericString,
  balisesRequises: z.boolean().optional(),
  obligationsClient: z.string().min(1, 'Requis'),
  responsabilites: z.string().min(1, 'Requis'),
  modalitesPaiement: z.array(paymentScheduleEntrySchema),
})

export type PaymentScheduleEntryFormValues = z.infer<typeof paymentScheduleEntrySchema>
export type ContractCreationFormValues = z.infer<typeof contractCreationSchema>
