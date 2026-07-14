import { useIsMobile } from './useBreakpoint'

/** 'tablet' réservé pour une future expérience tablette dédiée (sprint012 : tablette hérite du Desktop). */
export type DeviceTier = 'mobile' | 'desktop'

/**
 * Sémantique "à quel arbre de composants appartient-on" au-dessus de `useIsMobile`
 * (source unique de la souscription `matchMedia` 768px, inchangée, toujours utilisée
 * directement par `Modal.tsx`). Convention à respecter partout : tester
 * `tier === 'mobile'` (jamais `tier === 'desktop'` pour dire "pas mobile"), pour
 * qu'une future 3e valeur ('tablet') ne route pas silencieusement mal.
 */
export function useDeviceTier(): DeviceTier {
  return useIsMobile() ? 'mobile' : 'desktop'
}
