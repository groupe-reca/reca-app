import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { PaymentCard } from './PaymentCard'
import { PaymentsStatsRow } from './PaymentsStatsRow'
import { PAYMENT_METHOD_FILTER_OPTIONS, usePaymentsListFilters } from '../hooks/usePaymentsListFilters'
import type { PaymentMethodFilter } from '../hooks/usePaymentsListFilters'
import type { Payment } from '../types/payment.types'

type PaymentsListContentProps = {
  payments: Payment[] | undefined
  isLoading: boolean
  isError: boolean
}

/** Même gabarit que `ContractsListContent.tsx`. */
export function PaymentsListContent({ payments, isLoading, isError }: PaymentsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={payments}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun paiement pour le moment."
      errorLabel="Impossible de charger les paiements."
    >
      {(data) => (
        <PaymentsListBody
          payments={data}
          onSelect={(payment) => payment.invoice && navigate(`/invoices/${payment.invoice.id}`)}
        />
      )}
    </QueryState>
  )
}

function PaymentsListBody({
  payments,
  onSelect,
}: {
  payments: Payment[]
  onSelect: (payment: Payment) => void
}) {
  const { search, setSearch, methodFilter, setMethodFilter, filtered } = usePaymentsListFilters(payments)

  return (
    <div className="flex flex-col gap-4">
      <PaymentsStatsRow payments={payments} />

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Méthode, référence, numéro de facture…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={PAYMENT_METHOD_FILTER_OPTIONS}
        activeId={methodFilter}
        onChange={(id) => setMethodFilter(id as PaymentMethodFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun paiement ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} onClick={() => onSelect(payment)} />
          ))}
        </div>
      )}
    </div>
  )
}
