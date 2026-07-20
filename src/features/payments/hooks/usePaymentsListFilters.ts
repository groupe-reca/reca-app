import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import { PAYMENT_METHODS } from '../types/payment.types'
import type { Payment } from '../types/payment.types'

export type PaymentMethodFilter = 'tous' | (typeof PAYMENT_METHODS)[number]

export const PAYMENT_METHOD_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  ...PAYMENT_METHODS.map((method) => ({ id: method, label: method })),
]

/** Recherche + filtre par méthode de la page liste Paiements — état purement local, pas de nouvel appel réseau. */
export function usePaymentsListFilters(payments: Payment[] | undefined) {
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState<PaymentMethodFilter>('tous')

  const filtered = useMemo(() => {
    if (!payments) return []
    const term = search.trim().toLowerCase()

    return payments.filter((payment) => {
      if (methodFilter !== 'tous' && payment.methode !== methodFilter) return false
      if (!term) return true
      const haystack = [payment.methode ?? '', payment.reference ?? '', payment.invoice?.numero ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [payments, search, methodFilter])

  return { search, setSearch, methodFilter, setMethodFilter, filtered }
}
