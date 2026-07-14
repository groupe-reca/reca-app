import { Card } from '@/components/ui/Card'
import { PropertyZonesContent } from './PropertyZonesContent'
import type { PropertyZonesContentProps } from './PropertyZonesContent'

/**
 * Panneau colonne gauche (30%) de la sous-étape Délimiter — même cadre que
 * `PropertyInfoPanel` (Localiser), mais montre les zones tracées plutôt que
 * l'adresse du client (tâche 3).
 */
export function PropertyZonesPanel(props: PropertyZonesContentProps) {
  return (
    <Card className="flex h-fit flex-col gap-4">
      <PropertyZonesContent {...props} />
    </Card>
  )
}
