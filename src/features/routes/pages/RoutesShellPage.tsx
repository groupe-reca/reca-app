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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Routes</h1>
        <p className="text-body text-reca-gray-medium">
          Organisation permanente du territoire de déneigement.
        </p>
      </div>
      <RoutesTabs activeId={activeTabId} onChange={handleTabChange} />
      <Outlet />
    </div>
  )
}
