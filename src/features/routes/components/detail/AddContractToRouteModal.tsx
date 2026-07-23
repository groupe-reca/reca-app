import { Modal } from '@/components/ui/Modal'
import { QueryState } from '@/components/ui/QueryState'
import { Button } from '@/components/ui/Button'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import { useUnassignedContracts } from '../../hooks/useUnassignedContracts'
import { useAssignContractToRoute } from '../../hooks/useAssignContractToRoute'

type AddContractToRouteModalProps = {
  open: boolean
  onClose: () => void
  routeId: string
}

export function AddContractToRouteModal({ open, onClose, routeId }: AddContractToRouteModalProps) {
  const { data: contracts, isLoading, isError } = useUnassignedContracts()
  const assignContract = useAssignContractToRoute()

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un contrat">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={contracts}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucun contrat disponible à assigner."
        errorLabel="Impossible de charger les contrats disponibles."
      >
        {(data) => (
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
            {data.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col gap-2 rounded-control border border-reca-gray-light p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-body font-semibold text-reca-black">{contract.numero}</span>
                    <ContractStatusBadge status={contract.statut} />
                  </div>
                  <span className="text-body text-reca-black">{contract.clientName}</span>
                  <span className="text-label text-reca-gray-medium">{contract.adresse ?? '—'}</span>
                </div>
                <Button
                  variant="secondary"
                  isLoading={assignContract.isPending}
                  onClick={() => assignContract.mutate({ contractId: contract.id, routeId })}
                >
                  Ajouter
                </Button>
              </div>
            ))}
          </div>
        )}
      </QueryState>
    </Modal>
  )
}
