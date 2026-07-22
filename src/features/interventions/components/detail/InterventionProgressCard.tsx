import { Card } from '@/components/ui/Card'
import { summarizeItems } from '../../services/interventionMetrics.service'
import type { InterventionItem, InterventionItemStatus } from '../../types/interventionItem.types'

const CHIP_ORDER: { status: InterventionItemStatus; label: string; dotClass: string }[] = [
  { status: 'terminee', label: 'Terminées', dotClass: 'bg-reca-success' },
  { status: 'en_cours', label: 'En cours', dotClass: 'bg-reca-info' },
  { status: 'a_reprendre', label: 'À reprendre', dotClass: 'bg-reca-warning' },
  { status: 'planifiee', label: 'En attente', dotClass: 'bg-reca-gray-medium' },
]

/** "Progression" — comptage par statut (couleurs alignées sur la légende de `InterventionMapView`) + barre. */
export function InterventionProgressCard({ items }: { items: InterventionItem[] }) {
  const { counts, total, completed } = summarizeItems(items)
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-subtitle font-semibold text-reca-black">Progression</h2>
        <span className="text-body font-medium text-reca-black">{total} résidences</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-reca-gray-light">
        <div className="h-full rounded-full bg-reca-success transition-[width]" style={{ width: `${percent}%` }} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CHIP_ORDER.map((chip) => (
          <div key={chip.status} className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-label text-reca-gray-medium">
              <span className={`size-2 rounded-full ${chip.dotClass}`} aria-hidden="true" />
              {chip.label}
            </span>
            <span className="text-h2 font-semibold text-reca-black">{counts[chip.status]}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
