import { Card } from '@/components/ui/Card'
import { InterventionItemCard } from './InterventionItemCard'
import type { InterventionItem } from '../../types/interventionItem.types'

type InterventionResidencesCardProps = {
  interventionId: string
  items: InterventionItem[]
}

/** "Liste des résidences" — consomme les items déjà chargés par la page parent, pas de self-fetch. */
export function InterventionResidencesCard({ interventionId, items }: InterventionResidencesCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Liste des résidences</h2>
      {items.length === 0 ? (
        <p className="text-body text-reca-gray-medium">Aucune résidence pour cette intervention.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <InterventionItemCard key={item.id} interventionId={interventionId} item={item} />
          ))}
        </div>
      )}
    </Card>
  )
}
