import { useMemo } from 'react'
import { AlertTriangle, Ban, CheckCircle2, FileEdit, Send, Split } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Invoice } from '../types/invoice.types'

type InvoicesStatsRowProps = {
  invoices: Invoice[]
}

export function InvoicesStatsRow({ invoices }: InvoicesStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: invoices.length,
      envoyees: invoices.filter((invoice) => invoice.statut === 'envoyee').length,
      payees: invoices.filter((invoice) => invoice.statut === 'payee').length,
      partielles: invoices.filter((invoice) => invoice.statut === 'partiellement_payee').length,
      enRetard: invoices.filter((invoice) => invoice.statut === 'en_retard').length,
      annulees: invoices.filter((invoice) => invoice.statut === 'annulee').length,
    }),
    [invoices],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard icon={FileEdit} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={Send} iconColor="purple" value={counts.envoyees} label="Envoyées" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.payees} label="Payées" />
      <StatCard icon={Split} iconColor="yellow" value={counts.partielles} label="Partiellement payées" />
      <StatCard icon={AlertTriangle} iconColor="red" value={counts.enRetard} label="En retard" />
      <StatCard icon={Ban} iconColor="gray" value={counts.annulees} label="Annulées" />
    </div>
  )
}
