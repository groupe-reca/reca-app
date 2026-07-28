import { useMemo } from 'react'
import { CircleAlert, FileEdit, FileText, ShieldCheck, Signature } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Contract } from '../types/contract.types'

type ContractsStatsRowProps = {
  contracts: Contract[]
}

export function ContractsStatsRow({ contracts }: ContractsStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: contracts.length,
      actifs: contracts.filter((contract) => contract.statut === 'actif').length,
      aSigner: contracts.filter((contract) => contract.statut === 'a_signer').length,
      brouillons: contracts.filter((contract) => contract.statut === 'brouillon').length,
      expires: contracts.filter((contract) => contract.statut === 'expire').length,
    }),
    [contracts],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard icon={FileText} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={ShieldCheck} iconColor="green" value={counts.actifs} label="Actifs" />
      <StatCard icon={Signature} iconColor="purple" value={counts.aSigner} label="À signer" />
      <StatCard icon={FileEdit} iconColor="gray" value={counts.brouillons} label="Brouillons" />
      <StatCard icon={CircleAlert} iconColor="red" value={counts.expires} label="Expirés" />
    </div>
  )
}
