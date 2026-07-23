import type { MissionStatus } from './mission.types'

export const MISSION_EVENT_TYPES = [
  'mission_creee',
  'mission_debutee',
  'mission_pausee',
  'mission_reprise',
  'mission_terminee',
  'mission_terminee_avec_anomalies',
  'mission_fermee_de_force',
  'mission_annulee',
] as const
export type MissionEventType = (typeof MISSION_EVENT_TYPES)[number]

export const MISSION_EVENT_TYPE_LABELS: Record<MissionEventType, string> = {
  mission_creee: 'Création',
  mission_debutee: 'Début',
  mission_pausee: 'Pause',
  mission_reprise: 'Reprise',
  mission_terminee: 'Fin',
  mission_terminee_avec_anomalies: 'Fin (avec anomalies)',
  mission_fermee_de_force: 'Fermeture forcée',
  mission_annulee: 'Annulation',
}

export type MissionEventPayload = { statut?: MissionStatus } | null

export type MissionEventActorRef = {
  id: string
  nom: string | null
}

export type MissionEventRow = {
  id: string
  mission_id: string
  type: MissionEventType
  payload: MissionEventPayload
  created_at: string
  created_by: string | null
  author: MissionEventActorRef | null
}

export type MissionEvent = {
  id: string
  missionId: string
  type: MissionEventType
  payload: MissionEventPayload
  createdAt: string
  author: MissionEventActorRef | null
}
