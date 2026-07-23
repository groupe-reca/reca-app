import { Card } from '@/components/ui/Card'
import type { RouteSummary } from '../types/route.types'

type RouteCardProps = {
  route: RouteSummary
  onClick: () => void
}

export function RouteCard({ route, onClick }: RouteCardProps) {
  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-center gap-3">
        <span
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: route.couleur }}
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-body font-semibold text-reca-black">{route.nom}</span>
          <span className="text-label text-reca-gray-medium">
            {route.contractCount} contrat{route.contractCount > 1 ? 's' : ''} · {route.operatorName ?? '—'} ·{' '}
            {route.equipmentName ?? '—'}
          </span>
        </div>
      </div>
    </Card>
  )
}
