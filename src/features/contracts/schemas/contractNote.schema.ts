import { z } from 'zod'

export const contractNoteSchema = z.object({
  message: z.string().min(1, 'Message requis'),
})

export type ContractNoteFormValues = z.infer<typeof contractNoteSchema>
