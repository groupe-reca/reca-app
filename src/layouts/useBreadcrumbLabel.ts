import { createContext, useContext, useEffect } from 'react'

export type BreadcrumbLabelContextValue = {
  label: string | null
  setLabel: (label: string | null) => void
}

/** Fichier hooks-only (pas de composant) — le Provider vit dans `BreadcrumbLabelContext.tsx` (règle Fast Refresh). */
export const BreadcrumbLabelContext = createContext<BreadcrumbLabelContextValue | null>(null)

/** Lu par `Breadcrumb` (desktop) et `MobileHeader` (mobile) pour remplacer le libellé du dernier crumb. */
export function useBreadcrumbLabelValue() {
  return useContext(BreadcrumbLabelContext)?.label ?? null
}

/**
 * Appelé par une page de détail pour remplacer le libellé statique déclaré par sa route
 * (`handle.breadcrumb`, ex. `'Détail'`) par une valeur issue de la donnée chargée
 * (ex. le numéro de contrat → `Centre des opérations › Contrats › CTR-000055`).
 *
 * Passer `null`/`undefined` (donnée pas encore chargée) laisse le libellé de route en place.
 *
 * Note sur le piège de boucle de rendu infinie documenté sur `RoutesShellPage` (une valeur
 * de contexte recréée à chaque rendu redéclenche indéfiniment l'effet qui l'écrit) : il ne
 * s'applique pas ici, car ce qui est publié est une **chaîne**, comparée par valeur — React
 * fait `bail out` sur un `setState` de valeur identique. Le `value` du Provider est mémoïsé
 * malgré tout, par sécurité.
 */
export function useBreadcrumbLabel(label: string | null | undefined) {
  const ctx = useContext(BreadcrumbLabelContext)
  useEffect(() => {
    ctx?.setLabel(label ?? null)
    return () => ctx?.setLabel(null)
  }, [ctx, label])
}
