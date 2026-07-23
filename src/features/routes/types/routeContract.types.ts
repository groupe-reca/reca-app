import type { ContractStatus } from '@/features/contracts/types/contract.types'

export type RouteContractRow = {
  id: string
  route_id: string
  contract_id: string
  ordre: number
  created_at: string
  deleted_at: string | null
}

export type RouteContract = {
  id: string
  routeId: string
  contractId: string
  ordre: number
  numero: string
  adresseGeocodee: string | null
  statut: ContractStatus
}
