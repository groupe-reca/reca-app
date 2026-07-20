import { useEffect } from 'react'
import { useSession } from '@/features/auth/hooks/useSession'
import type { Theme } from '@/features/auth/types/auth.types'
import { useUpdateTheme } from '@/features/settings/hooks/useUpdateTheme'

/**
 * Sombre par défaut tant qu'aucune session n'est chargée (écran de connexion) —
 * cohérent avec `class="dark"` posé sur `<html>` dans `index.html`.
 */
const DEFAULT_THEME: Theme = 'sombre'

export function useTheme() {
  const { data: session } = useSession()
  const updateTheme = useUpdateTheme()
  const theme = session?.user.theme ?? DEFAULT_THEME

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'sombre')
  }, [theme])

  return {
    theme,
    setTheme: (nextTheme: Theme) => updateTheme.mutate(nextTheme),
    isUpdating: updateTheme.isPending,
  }
}
