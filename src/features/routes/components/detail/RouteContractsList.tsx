import { useState } from 'react'
import { QueryState } from '@/components/ui/QueryState'
import { useReorderRouteContract } from '../../hooks/useReorderRouteContract'
import { useRemoveContractFromRoute } from '../../hooks/useRemoveContractFromRoute'
import { RouteContractCard } from './RouteContractCard'
import { TransferContractModal } from './TransferContractModal'
import type { RouteContract } from '../../types/routeContract.types'

type RouteContractsListProps = {
  routeId: string
  routeContracts: RouteContract[] | undefined
  isLoading: boolean
  isError: boolean
}

export function RouteContractsList({ routeId, routeContracts, isLoading, isError }: RouteContractsListProps) {
  const [transferTarget, setTransferTarget] = useState<RouteContract | null>(null)
  const reorder = useReorderRouteContract(routeId)
  const removeContract = useRemoveContractFromRoute()

  return (
    <>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={routeContracts}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucun contrat dans cette route."
        errorLabel="Impossible de charger les contrats de la route."
      >
        {(data) => (
          <div className="flex flex-col gap-3">
            {data.map((routeContract, index) => (
              <RouteContractCard
                key={routeContract.id}
                routeContract={routeContract}
                canMoveUp={index > 0}
                canMoveDown={index < data.length - 1}
                onMoveUp={() => reorder.mutate({ id: routeContract.id, direction: 'up' })}
                onMoveDown={() => reorder.mutate({ id: routeContract.id, direction: 'down' })}
                onTransfer={() => setTransferTarget(routeContract)}
                onRemove={() => removeContract.mutate(routeContract.id)}
              />
            ))}
          </div>
        )}
      </QueryState>

      <TransferContractModal
        open={transferTarget !== null}
        onClose={() => setTransferTarget(null)}
        routeContract={transferTarget}
        currentRouteId={routeId}
      />
    </>
  )
}
