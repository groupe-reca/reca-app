import { useMemo } from 'react'
import { CheckCircle2, PhoneCall, Send, Sparkles, XCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Lead } from '../types/lead.types'

type LeadsStatsRowProps = {
  leads: Lead[]
}

export function LeadsStatsRow({ leads }: LeadsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: leads.length,
      nouveaux: leads.filter((lead) => lead.statut === 'nouveau').length,
      contactes: leads.filter((lead) => lead.statut === 'contacte').length,
      convertis: leads.filter((lead) => lead.statut === 'converti').length,
      perdus: leads.filter((lead) => lead.statut === 'perdu').length,
    }),
    [leads],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={Sparkles} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={PhoneCall} iconColor="orange" value={counts.nouveaux} label="Nouveaux" />
      <StatCard icon={Send} iconColor="purple" value={counts.contactes} label="Contactés" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.convertis} label="Convertis" />
      <StatCard icon={XCircle} iconColor="gray" value={counts.perdus} label="Perdus" />
    </div>
  )
}
