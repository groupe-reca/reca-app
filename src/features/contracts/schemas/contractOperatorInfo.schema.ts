import { z } from 'zod'

export const contractOperatorInfoFieldSchema = z.object({
  value: z.string().optional(),
})

export type ContractOperatorInfoFieldValues = z.infer<typeof contractOperatorInfoFieldSchema>

export type ContractOperatorInfoField = 'obstaclesConnus' | 'messageOperateur' | 'consignesSpeciales'
