import { useMemo } from 'react'
import { Calendar, CreditCard, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency } from '@/lib/format'
import type { Payment } from '../types/payment.types'

type PaymentsStatsRowProps = {
  payments: Payment[]
}

/** Même gabarit que `ContractsStatsRow.tsx`. */
export function PaymentsStatsRow({ payments }: PaymentsStatsRowProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const total = payments.reduce((sum, payment) => sum + payment.montant, 0)
    const ceMoisCi = payments.filter((payment) => {
      const date = new Date(payment.date)
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    }).length

    return { count: payments.length, total, ceMoisCi }
  }, [payments])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard icon={CreditCard} iconColor="blue" value={stats.count} label="Total" />
      <StatCard icon={DollarSign} iconColor="green" value={formatCurrency(stats.total)} label="Montant total" />
      <StatCard icon={Calendar} iconColor="purple" value={stats.ceMoisCi} label="Ce mois-ci" />
    </div>
  )
}
