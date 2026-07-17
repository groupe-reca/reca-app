import { z } from 'zod'
import { DEPOT_NEIGE, MODE_CONCLUSION } from '../types/contract.types'

export const contractWizardDefaultsSchema = z.object({
  saison: z.string().min(1, 'La saison est requise'),
  dateDebut: z.string().min(1, 'La date de début est requise'),
  dateFin: z.string().min(1, 'La date de fin est requise'),
  dateDeuxiemeVersement: z.string().min(1, 'La date du deuxième versement est requise'),
  serviceCodes: z.array(z.string()).min(1, 'Au moins un service doit être actif par défaut'),
  seuilDeclenchementCm: z.union([z.literal(2), z.literal(3), z.literal(5)]),
  heurePremierPassage: z.string().min(1, "L'heure limite est requise"),
  depotNeige: z.enum(DEPOT_NEIGE),
  modeConclusion: z.enum(MODE_CONCLUSION),
})

export type ContractWizardDefaultsFormValues = z.infer<typeof contractWizardDefaultsSchema>
