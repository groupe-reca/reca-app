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

export const serviceEntrySchema = z.object({
  code: z.enum(['deneigement', 'epandage', 'soufflage', 'escaliers', 'toiture', 'autres']),
  label: z.string(),
  active: z.boolean(),
  precisions: z.string().nullable(),
})

export const obligationsAnswersSchema = z.object({
  balisesRequises: z.boolean(),
  seuilDeclenchementCm: z.union([z.literal(2), z.literal(3), z.literal(5)]),
  accumulationMaximaleCm: z.number().min(0).nullable(),
  entreeLibreObligatoire: z.boolean(),
  animaux: z.boolean(),
  portail: z.boolean(),
  autresParticularites: z.string(),
})

export const contractCreationSchema = z.object({
  // Étape 1 — Client (informations générales du contrat)
  type: z.string().optional(),
  saison: z.string().optional(),
  prix: optionalNumericString,
  dateSignature: z.string().optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  renouvellement: z.boolean().optional(),
  notes: z.string().optional(),

  // Étape 2 — Analyse de la propriété
  adresseGeocodee: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  zones: z.array(contractZoneSchema).min(1, 'Au moins une zone doit être tracée'),

  // Étape 3 — Services
  services: z.array(serviceEntrySchema),

  // Étape 4 — Obligations (génère les clauses automatiquement)
  obligations: obligationsAnswersSchema,

  // Étape 5 — Paiement
  modePaiement: z.string().min(1, 'Mode de paiement requis'),
  modalitesPaiement: z.array(paymentScheduleEntrySchema),
})

export type PaymentScheduleEntryFormValues = z.infer<typeof paymentScheduleEntrySchema>
export type ContractZoneFormValues = z.infer<typeof contractZoneSchema>
export type ServiceEntryFormValues = z.infer<typeof serviceEntrySchema>
export type ObligationsAnswersFormValues = z.infer<typeof obligationsAnswersSchema>
export type ContractCreationFormValues = z.infer<typeof contractCreationSchema>
