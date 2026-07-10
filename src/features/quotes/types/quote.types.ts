export type QuoteStatus = 'brouillon' | 'envoyee' | 'acceptee' | 'refusee' | 'expiree'

export const QUOTE_STATUSES: QuoteStatus[] = ['brouillon', 'envoyee', 'acceptee', 'refusee', 'expiree']

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
  expiree: 'Expirée',
}

export type QuoteLeadRef = {
  id: string
  numero: string
  prenom: string
  nom: string
}

export type QuoteRow = {
  id: string
  numero: string
  lead_id: string | null
  client_id: string | null
  montant: number
  taxes: number
  total: number
  statut: QuoteStatus
  expiration: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Quote = {
  id: string
  numero: string
  leadId: string | null
  clientId: string | null
  montant: number
  taxes: number
  total: number
  statut: QuoteStatus
  expiration: string | null
  notes: string | null
  createdAt: string
  lead: QuoteLeadRef | null
}
