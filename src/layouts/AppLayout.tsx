import { useState } from 'react'
import { LogOut, Menu } from 'lucide-react'
import { Outlet } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Breadcrumb } from './Breadcrumb'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const logout = useLogout()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-reca-snow">
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-reca-gray-light bg-white px-4 lg:h-[72px] lg:px-6">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-black hover:bg-reca-gray-light lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <Button variant="ghost" isLoading={logout.isPending} onClick={() => logout.mutate()}>
            <LogOut className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </header>
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
