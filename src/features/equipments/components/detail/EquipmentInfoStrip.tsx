import { Calendar, Fingerprint, IdCard, Tag, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import type { Equipment } from '../../types/equipment.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

/** "Informations générales" — liste verticale compacte, même convention que `ContractInfoStrip.tsx`. */
export function EquipmentInfoStrip({ equipment }: { equipment: Equipment }) {
  const rows: InfoItem[] = [
    { icon: Tag, label: 'Catégorie', value: equipment.categorie ?? '—' },
    {
      icon: Wrench,
      label: 'Marque / Modèle',
      value: [equipment.marque, equipment.modele].filter(Boolean).join(' ') || '—',
    },
    { icon: Calendar, label: 'Année', value: equipment.annee ?? '—' },
    { icon: IdCard, label: 'Plaque', value: equipment.plaque ?? '—' },
    { icon: Fingerprint, label: 'Numéro de série', value: equipment.numeroSerie ?? '—' },
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
