import type { ContractStatus } from '@/features/contracts/types/contract.types'

export type UnassignedContract = {
  id: string
  numero: string
  clientName: string
  adresse: string | null
  type: string | null
  statut: ContractStatus
}
