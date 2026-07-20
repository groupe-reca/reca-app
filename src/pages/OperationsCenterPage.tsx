import { FileCheck2, FileText, Receipt, Users } from 'lucide-react'
import { QueryState } from '@/components/ui/QueryState'
import { StatCard } from '@/components/ui/StatCard'
import { ListRow } from '@/components/ui/ListRow'
import { useContracts } from '@/features/contracts/hooks/useContracts'
import { useClients } from '@/features/clients/hooks/useClients'
import { useInvoices } from '@/features/invoices/hooks/useInvoices'
import { CONTRACT_STATUS_COLORS } from '@/features/contracts/constants/contractStatusColors'
import { formatCurrency, formatRelativeTime } from '@/lib/format'
import type { Contract } from '@/features/contracts/types/contract.types'
import type { Client } from '@/features/clients/types/client.types'
import type { Invoice } from '@/features/invoices/types/invoice.types'

const PENDING_INVOICE_STATUSES = ['envoyee', 'partiellement_payee', 'en_retard'] as const

type DashboardData = {
  contracts: Contract[]
  clients: Client[]
  invoices: Invoice[]
}

export function OperationsCenterPage() {
  const contractsQuery = useContracts()
  const clientsQuery = useClients()
  const invoicesQuery = useInvoices()

  const isLoading = contractsQuery.isLoading || clientsQuery.isLoading || invoicesQuery.isLoading
  const isError = contractsQuery.isError || clientsQuery.isError || invoicesQuery.isError
  const data: DashboardData | undefined =
    contractsQuery.data && clientsQuery.data && invoicesQuery.data
      ? { contracts: contractsQuery.data, clients: clientsQuery.data, invoices: invoicesQuery.data }
      : undefined

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">
          Bonjour, voici l'état de vos opérations.
        </h1>
        <p className="text-body text-reca-gray-medium">
          Vue d'ensemble des contrats, clients et facturation.
        </p>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={data}
        errorLabel="Impossible de charger les données du tableau de bord."
      >
        {(dashboard) => <OperationsCenterContent {...dashboard} />}
      </QueryState>
    </div>
  )
}

function OperationsCenterContent({ contracts, clients, invoices }: DashboardData) {
  const activeContractsCount = contracts.filter((contract) => contract.statut === 'actif').length
  const pendingInvoices = invoices.filter((invoice) =>
    PENDING_INVOICE_STATUSES.includes(invoice.statut as (typeof PENDING_INVOICE_STATUSES)[number]),
  )
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.solde, 0)
  const recentContracts = [...contracts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        <StatCard
          icon={FileCheck2}
          iconColor="green"
          value={activeContractsCount}
          label="Contrats actifs"
        />
        <StatCard icon={Users} iconColor="blue" value={clients.length} label="Clients" />
        <StatCard
          icon={Receipt}
          iconColor="orange"
          value={pendingInvoices.length}
          label="Factures en attente"
          delta={{ label: `${formatCurrency(pendingAmount)} en solde`, tone: 'neutral' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-subtitle font-semibold text-reca-black">Activité récente</h2>
        {recentContracts.length === 0 ? (
          <p className="text-body text-reca-gray-medium">Aucun contrat récent.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentContracts.map((contract) => (
              <ListRow
                key={contract.id}
                icon={FileText}
                iconColor={CONTRACT_STATUS_COLORS[contract.statut]}
                title={contract.client ? `${contract.client.prenom} ${contract.client.nom}` : contract.numero}
                subtitle={`Contrat ${contract.numero} · ${formatRelativeTime(contract.createdAt)}`}
                trailing={contract.prix != null ? formatCurrency(contract.prix) : undefined}
                chevron
                href={`/contracts/${contract.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
