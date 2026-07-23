import { Map as MapIcon } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import type { RouteMapRoute } from '../../types/routeMapPoint.types'

type RouteSelectorProps = {
  routes: RouteMapRoute[]
  value: string
  onChange: (value: string) => void
}

export function RouteSelector({ routes, value, onChange }: RouteSelectorProps) {
  return (
    <Select label="Route" icon={MapIcon} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="all">Toutes les routes</option>
      {routes.map((route) => (
        <option key={route.id} value={route.id}>
          {route.nom}
        </option>
      ))}
    </Select>
  )
}
