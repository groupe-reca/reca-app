import { ArrowDown, ArrowRightLeft, ArrowUp, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import type { RouteContract } from '../../types/routeContract.types'

type RouteContractCardProps = {
  routeContract: RouteContract
  canMoveUp: boolean
  canMoveDown: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onTransfer: () => void
  onRemove: () => void
}

export function RouteContractCard({
  routeContract,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onTransfer,
  onRemove,
}: RouteContractCardProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-body font-semibold text-reca-black">{routeContract.numero}</span>
          <ContractStatusBadge status={routeContract.statut} />
        </div>
        <span className="text-label text-reca-gray-medium">{routeContract.adresseGeocodee ?? '—'}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Monter"
          title="Monter"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          className="flex size-9 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-gray-light disabled:opacity-30"
        >
          <ArrowUp className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Descendre"
          title="Descendre"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          className="flex size-9 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-gray-light disabled:opacity-30"
        >
          <ArrowDown className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Transférer"
          title="Transférer"
          onClick={onTransfer}
          className="flex size-9 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-gray-light"
        >
          <ArrowRightLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Retirer"
          title="Retirer"
          onClick={onRemove}
          className="flex size-9 items-center justify-center rounded-control text-red-600 hover:bg-red-50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </Card>
  )
}
