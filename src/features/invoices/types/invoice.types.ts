export type InvoiceStatus = 'brouillon' | 'envoyee' | 'payee' | 'partiellement_payee' | 'en_retard' | 'annulee'

export const INVOICE_STATUSES: InvoiceStatus[] = [
  'brouillon',
  'envoyee',
  'payee',
  'partiellement_payee',
  'en_retard',
  'annulee',
]

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  brouillon: 'Brouillon',
  envoyee: 'Envoyée',
  payee: 'Payée',
  partiellement_payee: 'Partiellement payée',
  en_retard: 'En retard',
  annulee: 'Annulée',
}

export type InvoiceClientRef = {
  id: string
  numero: string
  prenom: string
  nom: string
}

export type InvoiceContractRef = {
  id: string
  numero: string
}

export type InvoiceRow = {
  id: string
  numero: string
  client_id: string
  contrat_id: string | null
  date: string
  sous_total: number
  tps: number
  tvq: number
  total: number
  solde: number
  statut: InvoiceStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Invoice = {
  id: string
  numero: string
  clientId: string
  contratId: string | null
  date: string
  sousTotal: number
  tps: number
  tvq: number
  total: number
  solde: number
  statut: InvoiceStatus
  createdAt: string
  client: InvoiceClientRef | null
  contract: InvoiceContractRef | null
}
