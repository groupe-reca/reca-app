import { Card } from '@/components/ui/Card'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import type { UnassignedContract } from '../../types/unassignedContract.types'
import { QuickAssignControl } from './QuickAssignControl'

type UnassignedContractCardProps = {
  contract: UnassignedContract
}

export function UnassignedContractCard({ contract }: UnassignedContractCardProps) {
  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-body font-semibold text-reca-black">{contract.numero}</span>
          <ContractStatusBadge status={contract.statut} />
        </div>
        <span className="text-body text-reca-black">{contract.clientName}</span>
        <span className="text-label text-reca-gray-medium">{contract.adresse ?? '—'}</span>
        {contract.type && <span className="text-label text-reca-gray-medium">{contract.type}</span>}
      </div>
      <QuickAssignControl contractId={contract.id} />
    </Card>
  )
}
