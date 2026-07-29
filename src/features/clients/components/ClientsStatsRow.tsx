import { useMemo } from 'react'
import { Briefcase, CheckCircle2, Home, Users, XCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Client } from '../types/client.types'

type ClientsStatsRowProps = {
  clients: Client[]
}

export function ClientsStatsRow({ clients }: ClientsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: clients.length,
      actifs: clients.filter((client) => client.statut === 'actif').length,
      inactifs: clients.filter((client) => client.statut === 'inactif').length,
      residentiels: clients.filter((client) => client.typeClient === 'residentiel').length,
      commerciaux: clients.filter((client) => client.typeClient === 'commercial').length,
    }),
    [clients],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={Users} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.actifs} label="Actifs" />
      <StatCard icon={XCircle} iconColor="gray" value={counts.inactifs} label="Inactifs" />
      <StatCard icon={Home} iconColor="purple" value={counts.residentiels} label="Résidentiels" />
      <StatCard icon={Briefcase} iconColor="orange" value={counts.commerciaux} label="Commerciaux" />
    </div>
  )
}
