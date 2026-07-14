import { useState } from 'react'
import { Outlet } from 'react-router'
import { Breadcrumb } from './Breadcrumb'
import { Sidebar } from './Sidebar'

/** Shell Desktop/Tablette (≥768px) — contenu strictement inchangé depuis avant sprint012 (juste renommé/extrait d'`AppLayout.tsx`). */
export function DesktopAppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-reca-snow">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Breadcrumb onOpenMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
