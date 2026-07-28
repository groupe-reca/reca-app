import { Plus } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { RoutesTabs } from '../components/RoutesTabs'

function tabIdFromPath(pathname: string): string {
  if (pathname.endsWith('/carte')) return 'carte'
  if (pathname.endsWith('/contrats')) return 'contrats'
  return 'routes'
}

export function RoutesShellPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTabId = tabIdFromPath(location.pathname)

  function handleTabChange(id: string) {
    navigate(id === 'routes' ? '/routes' : `/routes/${id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b border-reca-gray-light">
        <RoutesTabs activeId={activeTabId} onChange={handleTabChange} />
        {activeTabId === 'routes' && (
          <button
            type="button"
            onClick={() => navigate('/routes/new')}
            aria-label="Nouvelle route"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <Outlet />
    </div>
  )
}
