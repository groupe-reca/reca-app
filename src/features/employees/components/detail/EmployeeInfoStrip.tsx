import { Briefcase, Calendar, Mail, Phone, ShieldCheck, StickyNote } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatPhone } from '@/lib/format'
import type { Employee } from '../../types/employee.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

/** "Informations générales" — liste verticale compacte, même convention que `ContractInfoStrip.tsx`. */
export function EmployeeInfoStrip({ employee }: { employee: Employee }) {
  const rows: InfoItem[] = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: employee.telephone ? (
        <a href={`tel:${employee.telephone}`} className="text-reca-info hover:underline">
          {formatPhone(employee.telephone)}
        </a>
      ) : (
        '—'
      ),
    },
    {
      icon: Mail,
      label: 'Courriel',
      value: employee.courriel ? (
        <a href={`mailto:${employee.courriel}`} className="text-reca-info hover:underline">
          {employee.courriel}
        </a>
      ) : (
        '—'
      ),
    },
    { icon: Briefcase, label: 'Poste', value: employee.poste ?? '—' },
    { icon: ShieldCheck, label: 'Rôle', value: employee.role ?? '—' },
    { icon: Calendar, label: "Date d'embauche", value: employee.dateEmbauche ?? '—' },
    { icon: StickyNote, label: 'Notes', value: employee.notes ?? '—' },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Informations générales</h2>
      <div className="flex flex-col divide-y divide-reca-gray-light">
        {rows.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="flex items-center gap-2 text-body text-reca-gray-medium">
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </span>
            <span className="shrink-0 text-right text-body font-medium text-reca-black">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
