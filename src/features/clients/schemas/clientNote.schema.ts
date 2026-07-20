import { z } from 'zod'

export const clientNoteSchema = z.object({
  message: z.string().min(1, 'Message requis'),
})

export type ClientNoteFormValues = z.infer<typeof clientNoteSchema>
