import { BottomSheet } from '@/components/ui/BottomSheet'
import { PropertyZonesContent } from '../wizard/PropertyZonesContent'
import type { PropertyZonesContentProps } from '../wizard/PropertyZonesContent'

/** Équivalent mobile de `PropertyZonesPanel.tsx` — même contenu, dans un `BottomSheet` toujours présent (pas de `onClose`) au lieu d'une `Card` fixe. */
export function PropertyZonesSheet(props: PropertyZonesContentProps) {
  return (
    <BottomSheet open snapPoints={['peek', 'half', 'full']}>
      <div className="flex flex-col gap-4 pb-2">
        <PropertyZonesContent {...props} />
      </div>
    </BottomSheet>
  )
}
