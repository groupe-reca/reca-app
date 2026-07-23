import { z } from 'zod'

export const missionSchema = z.object({
  routeId: z.string().min(1, 'La route est requise'),
  date: z.string().min(1, 'La date est requise'),
  heurePrevue: z.string().min(1, "L'heure prévue est requise"),
  operatorId: z.string().min(1, "L'opérateur est requis"),
  equipmentId: z.string().min(1, "L'équipement est requis"),
  notes: z.string().optional(),
})

export type MissionFormValues = z.infer<typeof missionSchema>
