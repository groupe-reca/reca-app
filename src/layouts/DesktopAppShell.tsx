import { useState } from 'react'
import { Outlet } from 'react-router'
import { Breadcrumb } from './Breadcrumb'
import { Sidebar } from './Sidebar'
import { DesktopChromeProvider } from './DesktopChromeContext'
import { useDesktopImmersiveValue } from './useDesktopChrome'

/** Consommateur du contexte (doit être un enfant de `DesktopChromeProvider`) — bascule le padding de `<main>` en mode plein écran (tâche 7). */
function DesktopMain() {
  const immersive = useDesktopImmersiveValue()
  return (
    <main className={immersive ? 'min-h-0 flex-1 overflow-hidden' : 'flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'}>
      <Outlet />
    </main>
  )
}

/** Shell Desktop/Tablette (≥768px) — contenu strictement inchangé depuis avant sprint012 (juste renommé/extrait d'`AppLayout.tsx`), à l'exception du `DesktopChromeProvider` (tâche 7, mode plein écran temporaire). */
export function DesktopAppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <DesktopChromeProvider>
      <div className="flex h-screen overflow-hidden bg-reca-snow">
        <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Breadcrumb onOpenMenu={() => setMobileNavOpen(true)} />
          <DesktopMain />
        </div>
      </div>
    </DesktopChromeProvider>
  )
}
