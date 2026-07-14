import { Card } from '@/components/ui/Card'
import { PropertyInfoContent } from './PropertyInfoContent'
import type { PropertyInfoContentProps } from './PropertyInfoContent'

/** Panneau colonne gauche (30%) : identité de la propriété + état de localisation. */
export function PropertyInfoPanel(props: PropertyInfoContentProps) {
  return (
    <Card className="flex h-fit flex-col gap-4">
      <PropertyInfoContent {...props} />
    </Card>
  )
}
