import { BottomSheet } from '@/components/ui/BottomSheet'
import { PropertyInfoContent } from '../wizard/PropertyInfoContent'
import type { PropertyInfoContentProps } from '../wizard/PropertyInfoContent'

/** Équivalent mobile de `PropertyInfoPanel.tsx` — même contenu, dans un `BottomSheet` toujours présent (pas de `onClose`) au lieu d'une `Card` fixe. */
export function PropertyInfoSheet(props: PropertyInfoContentProps) {
  return (
    <BottomSheet open snapPoints={['peek', 'half']}>
      <div className="flex flex-col gap-4 pb-2">
        <PropertyInfoContent {...props} />
      </div>
    </BottomSheet>
  )
}
