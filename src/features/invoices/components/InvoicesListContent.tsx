import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { InvoiceCard } from './InvoiceCard'
import { InvoicesStatsRow } from './InvoicesStatsRow'
import { INVOICE_STATUS_FILTER_OPTIONS, useInvoicesListFilters } from '../hooks/useInvoicesListFilters'
import type { InvoiceStatusFilter } from '../hooks/useInvoicesListFilters'
import type { Invoice } from '../types/invoice.types'

type InvoicesListContentProps = {
  invoices: Invoice[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function InvoicesListContent({ invoices, isLoading, isError, showStats = true }: InvoicesListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={invoices}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune facture pour le moment."
      errorLabel="Impossible de charger les factures."
    >
      {(data) => (
        <InvoicesListBody
          invoices={data}
          showStats={showStats}
          onSelect={(invoice) => navigate(`/invoices/${invoice.id}`)}
        />
      )}
    </QueryState>
  )
}

function InvoicesListBody({
  invoices,
  showStats,
  onSelect,
}: {
  invoices: Invoice[]
  showStats: boolean
  onSelect: (invoice: Invoice) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useInvoicesListFilters(invoices)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <InvoicesStatsRow invoices={invoices} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, client, contrat…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={INVOICE_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as InvoiceStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucune facture ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} onClick={() => onSelect(invoice)} />
          ))}
        </div>
      )}
    </div>
  )
}
