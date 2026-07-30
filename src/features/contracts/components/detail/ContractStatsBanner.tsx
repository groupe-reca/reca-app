import { formatArea, formatCurrency, formatDateLong } from '@/lib/format'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { Contract } from '../../types/contract.types'

type Stat = { value: string; label: string }

/**
 * Les quatre données cherchées en premier sur un contrat de déneigement : le prix, la saison
 * couverte, la surface à déneiger et le nombre de zones. Le prix était auparavant noyé au
 * milieu d'une liste clé-valeur ; il ouvre désormais la fiche.
 */
export function ContractStatsBanner({
  contract,
  zones,
}: {
  contract: Contract
  zones: ContractZoneFormValues[]
}) {
  const totalSurface = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)
  const saison =
    contract.dateDebut && contract.dateFin
      ? `${formatDateLong(contract.dateDebut)} → ${formatDateLong(contract.dateFin)}`
      : (contract.saison ?? '—')

  const stats: Stat[] = [
    { value: contract.prix != null ? formatCurrency(contract.prix) : '—', label: 'Prix du contrat' },
    { value: saison, label: 'Saison' },
    { value: zones.length > 0 ? formatArea(totalSurface) : '—', label: 'Surface' },
    {
      value: `${zones.length} zone${zones.length > 1 ? 's' : ''}`,
      label: zones.length > 0 ? 'à déneiger' : 'tracée',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5">
          <span className="text-subtitle font-semibold text-reca-black">{stat.value}</span>
          <span className="text-label text-reca-gray-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
