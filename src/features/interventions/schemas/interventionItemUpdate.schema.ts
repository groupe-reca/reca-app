import { z } from 'zod'
import { INTERVENTION_ITEM_STATUSES } from '../types/interventionItem.types'

export const interventionItemUpdateSchema = z.object({
  statut: z.enum(INTERVENTION_ITEM_STATUSES),
  notes: z.string().optional(),
  codeProbleme: z.string().optional(),
})

export type InterventionItemUpdateFormValues = z.infer<typeof interventionItemUpdateSchema>
