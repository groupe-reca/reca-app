export const PAYMENT_METHODS = ['Interac', 'Comptant', 'Chèque', 'Virement', 'Carte'] as const

export type PaymentInvoiceRef = {
  id: string
  numero: string
  total: number
  solde: number
}

export type PaymentRow = {
  id: string
  facture_id: string
  montant: number
  methode: string | null
  reference: string | null
  date: string
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Payment = {
  id: string
  factureId: string
  montant: number
  methode: string | null
  reference: string | null
  date: string
  notes: string | null
  createdAt: string
  invoice: PaymentInvoiceRef | null
}
