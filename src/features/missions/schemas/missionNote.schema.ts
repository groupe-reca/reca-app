import { z } from 'zod'

export const missionNoteSchema = z.object({
  message: z.string().min(1, 'Message requis'),
})

export type MissionNoteFormValues = z.infer<typeof missionNoteSchema>
