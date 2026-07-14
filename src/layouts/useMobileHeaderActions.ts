import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

export type MobileHeaderActionsContextValue = {
  actions: ReactNode
  setActions: (actions: ReactNode) => void
}

/** Fichier hooks-only (pas de composant) — le Provider vit dans `MobileHeaderActionsContext.tsx` (règle Fast Refresh). */
export const MobileHeaderActionsContext = createContext<MobileHeaderActionsContextValue | null>(null)

/** Lu par `MobileHeader` pour afficher les actions principales de la page courante. */
export function useMobileHeaderActionsValue() {
  return useContext(MobileHeaderActionsContext)?.actions ?? null
}

/**
 * Appelé par une page mobile pour enregistrer 0-2 actions dans le Header compact
 * (ex. bouton "+" Nouveau contrat). La plupart des pages non-Contrats n'appellent
 * jamais ce hook — le Header retombe alors sur son défaut titre+retour seul.
 */
export function useMobileHeaderActions(actions: ReactNode) {
  const ctx = useContext(MobileHeaderActionsContext)
  useEffect(() => {
    ctx?.setActions(actions)
    return () => ctx?.setActions(null)
  }, [ctx, actions])
}
