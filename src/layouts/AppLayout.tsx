import { LogOut } from 'lucide-react'
import { Outlet } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Breadcrumb } from './Breadcrumb'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const logout = useLogout()

  return (
    <div className="flex min-h-screen bg-reca-snow">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] shrink-0 items-center justify-end border-b border-reca-gray-light bg-white px-6">
          <Button variant="ghost" isLoading={logout.isPending} onClick={() => logout.mutate()}>
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </Button>
        </header>
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
