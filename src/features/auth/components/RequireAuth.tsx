import { Loader2 } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '../hooks/useSession'
import type { Role } from '../types/auth.types'

export function RequireAuth() {
  const { data: session, isLoading } = useSession()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-reca-snow">
        <Loader2 className="size-6 animate-spin text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

type RequireRoleProps = {
  roles: Role[]
}

export function RequireRole({ roles }: RequireRoleProps) {
  const { data: session, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-reca-snow">
        <Loader2 className="size-6 animate-spin text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  if (!session || !roles.includes(session.user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
