import { z } from 'zod'

const optionalYear = z
  .string()
  .optional()
  .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 1900), 'Année invalide')

export const equipmentSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  categorie: z.string().optional(),
  marque: z.string().optional(),
  modele: z.string().optional(),
  annee: optionalYear,
  plaque: z.string().optional(),
  numeroSerie: z.string().optional(),
  entretien: z.string().optional(),
  notes: z.string().optional(),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>
