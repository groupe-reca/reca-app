import { ArrowRightLeft } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useRoutes } from '../../hooks/useRoutes'
import { useAssignContractToRoute } from '../../hooks/useAssignContractToRoute'
import type { RouteContract } from '../../types/routeContract.types'

type TransferContractModalProps = {
  open: boolean
  onClose: () => void
  routeContract: RouteContract | null
  currentRouteId: string
}

export function TransferContractModal({
  open,
  onClose,
  routeContract,
  currentRouteId,
}: TransferContractModalProps) {
  const { data: routes } = useRoutes()
  const assignContract = useAssignContractToRoute()
  const otherRoutes = (routes ?? []).filter((route) => route.id !== currentRouteId)

  return (
    <Modal open={open} onClose={onClose} title="Transférer le contrat">
      {routeContract && (
        <div className="flex flex-col gap-4">
          <p className="text-body text-reca-black">
            Transférer le contrat <span className="font-semibold">{routeContract.numero}</span> vers :
          </p>
          <Select
            label="Route de destination"
            icon={ArrowRightLeft}
            disabled={assignContract.isPending}
            defaultValue=""
            onChange={(event) => {
              const targetRouteId = event.target.value
              if (targetRouteId) {
                assignContract.mutate(
                  { contractId: routeContract.contractId, routeId: targetRouteId },
                  { onSuccess: onClose },
                )
              }
            }}
          >
            <option value="" disabled>
              Sélectionner une route...
            </option>
            {otherRoutes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.nom}
              </option>
            ))}
          </Select>
        </div>
      )}
    </Modal>
  )
}
