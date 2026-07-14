import { Outlet, useMatches } from 'react-router'
import { MobileBottomNavigation } from './MobileBottomNavigation'
import { MobileHeader } from './MobileHeader'
import { MobileHeaderActionsProvider } from './MobileHeaderActionsContext'

type RouteHandle = {
  hideMobileNav?: boolean
}

/**
 * Shell mobile (<768px, sprint012) — remplace Sidebar+Breadcrumb par Bottom
 * Navigation + Header compact pour toute l'app (chrome de navigation seulement, le
 * contenu de page de chaque module reste inchangé). Le Bottom Nav se masque de façon
 * déclarative via `handle: { hideMobileNav: true }` sur une route (ex. le Wizard
 * Contrats en plein écran) — lu ici via `useMatches()`, jamais un flag posé par la
 * page elle-même.
 */
export function MobileAppShell() {
  const matches = useMatches()
  const hideMobileNav = matches.some((match) => (match.handle as RouteHandle | undefined)?.hideMobileNav)

  return (
    <MobileHeaderActionsProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-reca-snow">
        <MobileHeader />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
        {!hideMobileNav && <MobileBottomNavigation />}
      </div>
    </MobileHeaderActionsProvider>
  )
}
