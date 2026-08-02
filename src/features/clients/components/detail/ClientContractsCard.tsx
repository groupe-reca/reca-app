import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EntityRow } from '@/components/ui/EntityRow'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { formatCurrency, formatDate } from '@/lib/format'

const COLLAPSED_COUNT = 3

export function ClientContractsCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const { data: contracts } = useClientContracts(clientId)
  const [showAll, setShowAll] = useState(false)

  const all = contracts ?? []
  const visible = showAll ? all : all.slice(0, COLLAPSED_COUNT)
  const total = all.reduce((sum, contract) => sum + (contract.prix ?? 0), 0)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-subtitle font-semibold text-reca-black">Contrats</h2>
        <Button variant="secondary" onClick={() => navigate(`/contracts/new?clientId=${clientId}`)}>
          <Plus className="size-4" aria-hidden="true" />
          Créer un contrat
        </Button>
      </div>

      {all.length === 0 ? (
        <p className="text-body text-reca-gray-medium">
          Aucun contrat pour ce client.{' '}
          <button
            type="button"
            onClick={() => navigate(`/contracts/new?clientId=${clientId}`)}
            className="font-medium text-reca-info hover:underline"
          >
            Créer le premier
          </button>
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {visible.map((contract) => (
              <EntityRow
                key={contract.id}
                to={`/contracts/${contract.id}`}
                identifier={contract.numero}
                label={[contract.type, contract.saison].filter(Boolean).join(' ')}
                pivot={`Fin : ${formatDate(contract.dateFin)}`}
                amount={contract.prix != null ? formatCurrency(contract.prix) : undefined}
                badge={<ContractStatusBadge status={contract.statut} />}
              />
            ))}
          </div>

          {all.length > COLLAPSED_COUNT && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex items-center justify-between text-label font-medium text-reca-info hover:underline"
            >
              Voir tous les contrats ({all.length})
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          )}

          <div className="flex items-center justify-between border-t border-reca-gray-light pt-3 text-label text-reca-gray-medium">
            <span>
              {all.length} {all.length > 1 ? 'contrats' : 'contrat'}
            </span>
            <span className="font-medium text-reca-black">{formatCurrency(total)}</span>
          </div>
        </>
      )}
    </Card>
  )
}
