export type LeadStatus = 'nouveau' | 'contacte' | 'soumission_envoyee' | 'converti' | 'perdu'

export const LEAD_STATUSES: LeadStatus[] = [
  'nouveau',
  'contacte',
  'soumission_envoyee',
  'converti',
  'perdu',
]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  soumission_envoyee: 'Soumission envoyée',
  converti: 'Converti',
  perdu: 'Perdu',
}

export type LeadRow = {
  id: string
  numero: string
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
  type_service: string | null
  message: string | null
  source: string | null
  statut: LeadStatus
  assigne_a: string | null
  rappel_le: string | null
  rappel_note: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Lead = {
  id: string
  numero: string
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  codePostal: string | null
  typeService: string | null
  message: string | null
  source: string | null
  statut: LeadStatus
  assigneA: string | null
  rappelLe: string | null
  rappelNote: string | null
  createdAt: string
}
