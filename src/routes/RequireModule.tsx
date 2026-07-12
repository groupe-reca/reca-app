import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'
import { useSettings } from '@/features/settings/hooks/useSettings'
import type { ModuleKey } from '@/features/settings/types/settings.types'

type RequireModuleProps = {
  moduleKey: ModuleKey
}

export function RequireModule({ moduleKey }: RequireModuleProps) {
  const { data: settings, isLoading } = useSettings()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-reca-snow">
        <Loader2 className="size-6 animate-spin text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  if (!settings || !settings.modules[moduleKey]) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
