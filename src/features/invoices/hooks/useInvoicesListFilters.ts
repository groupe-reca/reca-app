import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Invoice, InvoiceStatus } from '../types/invoice.types'

export type InvoiceStatusFilter = 'tous' | InvoiceStatus

export const INVOICE_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'brouillon', label: 'Brouillons' },
  { id: 'envoyee', label: 'Envoyées' },
  { id: 'payee', label: 'Payées' },
  { id: 'partiellement_payee', label: 'Partiellement payées' },
  { id: 'en_retard', label: 'En retard' },
  { id: 'annulee', label: 'Annulées' },
]

/** Recherche + filtre par statut de la page liste Factures — état purement local, pas de nouvel appel réseau. */
export function useInvoicesListFilters(invoices: Invoice[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!invoices) return []
    const term = search.trim().toLowerCase()

    return invoices.filter((invoice) => {
      if (statusFilter !== 'tous' && invoice.statut !== statusFilter) return false
      if (!term) return true
      const haystack = [
        invoice.numero,
        invoice.client ? `${invoice.client.prenom} ${invoice.client.nom}` : '',
        invoice.contract?.numero ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [invoices, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
