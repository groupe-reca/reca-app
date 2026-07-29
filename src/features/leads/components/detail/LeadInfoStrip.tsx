import { Mail, MapPin, MessageSquare, Phone, Radio, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatPhone } from '@/lib/format'
import type { Lead } from '../../types/lead.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

/** "Informations générales" — liste verticale compacte, même convention que `ContractInfoStrip.tsx`. */
export function LeadInfoStrip({ lead }: { lead: Lead }) {
  const rows: InfoItem[] = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: lead.telephone ? (
        <a href={`tel:${lead.telephone}`} className="text-reca-red hover:underline">
          {formatPhone(lead.telephone)}
        </a>
      ) : (
        '—'
      ),
    },
    {
      icon: Mail,
      label: 'Courriel',
      value: lead.courriel ? (
        <a href={`mailto:${lead.courriel}`} className="text-reca-red hover:underline">
          {lead.courriel}
        </a>
      ) : (
        '—'
      ),
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: [lead.adresse, lead.ville, lead.codePostal].filter(Boolean).join(', ') || '—',
    },
    { icon: Wrench, label: 'Service', value: lead.typeService ?? '—' },
    { icon: Radio, label: 'Source', value: lead.source ?? '—' },
    { icon: MessageSquare, label: 'Message', value: lead.message ?? '—' },
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
