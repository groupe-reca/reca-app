import { QueryState } from '@/components/ui/QueryState'
import { useUnassignedContracts } from '../hooks/useUnassignedContracts'
import { UnassignedContractCard } from '../components/quickAssign/UnassignedContractCard'

export function ContratsTabPage() {
  const { data: contracts, isLoading, isError } = useUnassignedContracts()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={contracts}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun contrat à assigner pour le moment."
      errorLabel="Impossible de charger les contrats."
    >
      {(data) => (
        <div className="flex flex-col gap-3">
          {data.map((contract) => (
            <UnassignedContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </QueryState>
  )
}
