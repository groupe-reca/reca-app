import type { ContractStatus } from './contract.types'

export const CONTRACT_EVENT_TYPES = [
  'contrat_cree',
  'contrat_signe',
  'statut_modifie',
  'pdf_genere',
  'courriel_envoye',
] as const
export type ContractEventType = (typeof CONTRACT_EVENT_TYPES)[number]

export const CONTRACT_EVENT_TYPE_LABELS: Record<ContractEventType, string> = {
  contrat_cree: 'Contrat créé',
  contrat_signe: 'Contrat signé',
  statut_modifie: 'Statut modifié',
  pdf_genere: 'PDF généré',
  courriel_envoye: 'Courriel envoyé',
}

export type ContractEventPayload = { statut?: ContractStatus } | null

export type ContractEventActorRef = {
  id: string
  nom: string | null
}

export type ContractEventRow = {
  id: string
  contract_id: string
  type: ContractEventType
  payload: ContractEventPayload
  created_at: string
  created_by: string | null
  author: ContractEventActorRef | null
}

export type ContractEvent = {
  id: string
  contractId: string
  type: ContractEventType
  payload: ContractEventPayload
  createdAt: string
  author: ContractEventActorRef | null
}
