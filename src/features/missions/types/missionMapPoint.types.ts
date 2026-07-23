import type { MissionItemStatus } from './missionItem.types'

export type MissionMapPoint = {
  missionItemId: string
  contractId: string
  missionId: string
  itemStatus: MissionItemStatus
  color: string
  lng: number
  lat: number
  numero: string
  clientName: string
  adresse: string | null
}
