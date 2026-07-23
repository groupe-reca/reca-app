import type { ContractStatus } from '@/features/contracts/types/contract.types'

export type MissionItemStatus = 'en_attente' | 'en_cours' | 'terminee' | 'a_reprendre' | 'impossible'

export const MISSION_ITEM_STATUSES: MissionItemStatus[] = [
  'en_attente',
  'en_cours',
  'terminee',
  'a_reprendre',
  'impossible',
]

export const MISSION_ITEM_STATUS_LABELS: Record<MissionItemStatus, string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  terminee: 'Terminée',
  a_reprendre: 'À reprendre',
  impossible: 'Impossible',
}

export type MissionItemRow = {
  id: string
  mission_id: string
  contract_id: string
  statut: MissionItemStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type MissionItem = {
  id: string
  missionId: string
  contractId: string
  statut: MissionItemStatus
  createdAt: string
}

export type MissionItemSummary = MissionItem & {
  contractNumero: string
  contractStatut: ContractStatus
  clientName: string
  adresse: string | null
  lat: number | null
  lng: number | null
}
