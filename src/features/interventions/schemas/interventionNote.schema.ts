import { z } from 'zod'

export const interventionNoteSchema = z.object({
  message: z.string().min(1, 'Message requis'),
})

export type InterventionNoteFormValues = z.infer<typeof interventionNoteSchema>
