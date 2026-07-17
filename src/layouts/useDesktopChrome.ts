import { createContext, useContext, useEffect } from 'react'

export type DesktopChromeContextValue = {
  immersive: boolean
  setImmersive: (immersive: boolean) => void
}

/** Fichier hooks-only (pas de composant) — le Provider vit dans `DesktopChromeContext.tsx` (règle Fast Refresh). */
export const DesktopChromeContext = createContext<DesktopChromeContextValue | null>(null)

/** Lu par `Breadcrumb`/`DesktopAppShell` pour masquer le fil d'Ariane global et le padding de `<main>`. */
export function useDesktopImmersiveValue() {
  return useContext(DesktopChromeContext)?.immersive ?? false
}

/**
 * Appelé par une étape de page Desktop pour demander un mode plein écran temporaire
 * (masque le fil d'Ariane global + le padding de `<main>`, ex. carte immersive de
 * l'étape "Analyse & Zones" du Wizard Contrats, tâche 7). Réinitialisé automatiquement
 * au démontage — jamais laissé actif si le composant appelant disparaît.
 */
export function useDesktopImmersive(immersive: boolean) {
  const ctx = useContext(DesktopChromeContext)
  useEffect(() => {
    ctx?.setImmersive(immersive)
    return () => ctx?.setImmersive(false)
  }, [ctx, immersive])
}
