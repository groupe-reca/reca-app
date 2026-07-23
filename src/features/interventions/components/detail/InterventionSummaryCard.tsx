import { CalendarDays, Clock, Hourglass, Route as RouteIcon, Truck, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatDateLong, formatDurationShort } from '@/lib/format'
import { InterventionStatusBadge } from '../InterventionStatusBadge'
import type { Intervention } from '../../types/intervention.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

function formatHeure(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })
}

/** "Résumé" — liste verticale compacte, mirrors `ContractInfoStrip.tsx`. */
export function InterventionSummaryCard({ intervention }: { intervention: Intervention }) {
  const dureeSecondes =
    intervention.heureDebut && intervention.heureFin
      ? Math.max(0, Math.round((new Date(intervention.heureFin).getTime() - new Date(intervention.heureDebut).getTime()) / 1000))
      : null

  const rows: InfoItem[] = [
    { icon: CalendarDays, label: 'Date', value: formatDateLong(intervention.date) },
    { icon: Clock, label: 'Heure début', value: formatHeure(intervention.heureDebut) },
    { icon: Clock, label: 'Heure fin', value: formatHeure(intervention.heureFin) },
    { icon: Hourglass, label: 'Durée', value: dureeSecondes != null ? formatDurationShort(dureeSecondes) : '—' },
    { icon: RouteIcon, label: 'Route', value: intervention.route?.nom ?? '—' },
    {
      icon: User,
      label: 'Employé',
      value: intervention.employee ? `${intervention.employee.prenom} ${intervention.employee.nom}` : '—',
    },
    { icon: Truck, label: 'Équipement', value: intervention.equipment?.nom ?? '—' },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Résumé</h2>
      <div className="flex flex-col divide-y divide-reca-gray-light">
        {rows.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="flex items-center gap-2 text-body text-reca-gray-medium">
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </span>
            <span className="shrink-0 text-body font-medium text-reca-black">{item.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
          <span className="text-body text-reca-gray-medium">Statut</span>
          <InterventionStatusBadge status={intervention.statut} />
        </div>
      </div>
    </Card>
  )
}
