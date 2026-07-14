import { createContext, useContext } from 'react'

/**
 * Hauteur (px) du footer courant du Wizard mobile (`FloatingActionBar`), fournie par
 * `MobileWizard.tsx` à ses `children` — lue par `BottomSheet` (`src/components/ui/`)
 * pour ne jamais se positionner par-dessus la barre d'action flottante, qui occupe déjà
 * le bas de l'écran en flux normal alors que `BottomSheet` est un portail `fixed`
 * ancré au vrai bas du viewport. Défaut 0 : tout `BottomSheet` utilisé hors d'un
 * `MobileWizard` (ex. la feuille "Menu" de `MobileBottomNavigation`) n'est pas affecté.
 */
export const MobileFooterInsetContext = createContext(0)

export function useMobileFooterInset() {
  return useContext(MobileFooterInsetContext)
}
