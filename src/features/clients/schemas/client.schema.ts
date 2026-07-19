import { z } from 'zod'
import { CLIENT_LANGUES, CLIENT_STATUSES } from '../types/client.types'

const optionalCoordinate = z
  .string()
  .optional()
  .refine((value) => !value || !Number.isNaN(Number(value)), 'Doit être un nombre')

export const CLIENT_TYPES = ['residentiel', 'commercial'] as const
export type ClientType = (typeof CLIENT_TYPES)[number]

export const clientSchema = z
  .object({
    typeClient: z.enum(CLIENT_TYPES),
    prenom: z.string().min(1, 'Le prénom est requis'),
    nom: z.string().min(1, 'Le nom est requis'),
    entreprise: z.string().optional(),
    telephone: z.string().min(1, 'Le téléphone est requis'),
    courriel: z.union([z.literal(''), z.string().email('Courriel invalide')]).optional(),
    adresse: z.string().optional(),
    ville: z.string().optional(),
    codePostal: z.string().optional(),
    latitude: optionalCoordinate,
    longitude: optionalCoordinate,
    notes: z.string().optional(),
    statut: z.enum(CLIENT_STATUSES),
    langue: z.enum(CLIENT_LANGUES),
  })
  .refine((values) => values.typeClient !== 'commercial' || Boolean(values.entreprise?.trim()), {
    message: "Le nom de l'entreprise est requis pour un client commercial",
    path: ['entreprise'],
  })

export type ClientFormValues = z.infer<typeof clientSchema>
