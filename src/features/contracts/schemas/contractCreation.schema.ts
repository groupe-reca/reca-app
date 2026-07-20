import { z } from 'zod'
import { ZONE_TYPES } from '../types/contract.types'

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

export const contractZoneSchema = z.object({
  id: z.string(),
  type: z.enum(ZONE_TYPES),
  label: z.string().min(1, 'Nom de zone requis'),
  geojson: z.custom<GeoJSON.Polygon>(),
  surfaceM2: z.number().positive(),
  imageStoragePath: z.string().min(1),
  ordre: z.number(),
  capturedAt: z.string(),
})

export const contractPhotoSchema = z.object({
  id: z.string(),
  storagePath: z.string().min(1),
  ordre: z.number(),
})

/**
 * Champs communs aux 4 étapes, sans les contraintes qui ne doivent s'appliquer
 * qu'à la finalisation (voir contractCreationSchema vs contractDraftSchema plus
 * bas). Tâche 5 : "Client & Propriété" n'a plus de champ de formulaire propre
 * (type/saison/dates/mode de conclusion/renouvellement viennent désormais des
 * paramètres par défaut du Wizard, cf. `ContractWizardDefaults` — voir
 * `contracts.service.ts`) — seule l'étape "Analyse & Zones" (désormais
 * optionnelle, `zones`/`photos` peuvent rester vides) et "Modalités de
 * paiement" gardent des champs de formulaire.
 */
const contractFieldsShape = {
  // Analyse & Zones (optionnelle — déclenchée par "Outil de mesure")
  adresseGeocodee: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  zones: z.array(contractZoneSchema),
  photos: z.array(contractPhotoSchema),

  // Modalités de paiement
  prix: optionalNumericString,
  modePaiement: z.string(),
  modalitesPaiement: z.array(paymentScheduleEntrySchema),
  notes: z.string().optional(),
}

/** Schéma strict — utilisé pour "Créer" (finalisation). */
export const contractCreationSchema = z.object(contractFieldsShape).extend({
  modePaiement: z.string().min(1, 'Mode de paiement requis'),
})

/** Schéma allégé — utilisé pour "Enregistrer le brouillon", disponible dès l'étape 1 (aucune zone/échéancier requis). */
export const contractDraftSchema = z.object(contractFieldsShape)

export type PaymentScheduleEntryFormValues = z.infer<typeof paymentScheduleEntrySchema>
export type ContractZoneFormValues = z.infer<typeof contractZoneSchema>
export type ContractPhotoFormValues = z.infer<typeof contractPhotoSchema>
export type ContractCreationFormValues = z.infer<typeof contractCreationSchema>
export type ContractDraftFormValues = z.infer<typeof contractDraftSchema>
