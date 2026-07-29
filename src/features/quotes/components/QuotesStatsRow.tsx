import { useMemo } from 'react'
import { CheckCircle2, Clock, FileEdit, Send, XCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Quote } from '../types/quote.types'

type QuotesStatsRowProps = {
  quotes: Quote[]
}

export function QuotesStatsRow({ quotes }: QuotesStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: quotes.length,
      envoyees: quotes.filter((quote) => quote.statut === 'envoyee').length,
      acceptees: quotes.filter((quote) => quote.statut === 'acceptee').length,
      refusees: quotes.filter((quote) => quote.statut === 'refusee').length,
      expirees: quotes.filter((quote) => quote.statut === 'expiree').length,
    }),
    [quotes],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={FileEdit} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={Send} iconColor="purple" value={counts.envoyees} label="Envoyées" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.acceptees} label="Acceptées" />
      <StatCard icon={XCircle} iconColor="red" value={counts.refusees} label="Refusées" />
      <StatCard icon={Clock} iconColor="orange" value={counts.expirees} label="Expirées" />
    </div>
  )
}
