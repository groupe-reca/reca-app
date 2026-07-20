import type { Client } from '@/features/clients/types/client.types'
import type { Contract } from '@/features/contracts/types/contract.types'
import type { Payment } from '@/features/payments/types/payment.types'
import type { Settings } from '@/features/settings/types/settings.types'
import type { Invoice } from '../types/invoice.types'

/**
 * `Invoice.client`/`Invoice.contract` ne sont que des refs légères (numéro/nom, pas
 * l'adresse ni les coordonnées) — le PDF a besoin des objets complets, récupérés
 * séparément par la page (`useClient`/`useContract`), d'où ce type dédié plutôt que
 * de réutiliser `Invoice` tel quel comme le fait `ContractDocumentData` pour les contrats.
 */
export type InvoicePdfData = {
  invoice: Invoice
  client: Client | null
  contract: Contract | null
  payments: Payment[]
  settings: Settings
}
