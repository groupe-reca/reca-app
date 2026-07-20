import { useState } from 'react'
import { Calendar, ChevronRight, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { formatDateLong } from '@/lib/format'

const COLLAPSED_COUNT = 2

export function ClientContractsCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const { data: contracts } = useClientContracts(clientId)
  const [showAll, setShowAll] = useState(false)

  const all = contracts ?? []
  const visible = showAll ? all : all.slice(0, COLLAPSED_COUNT)

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
        <p className="text-body text-reca-gray-medium">Aucun contrat pour ce client.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((contract) => (
            <Link
              key={contract.id}
              to={`/contracts/${contract.id}`}
              className="flex flex-col gap-2 rounded-control border border-reca-gray-light px-4 py-3 hover:bg-reca-snow"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-body font-medium text-reca-black">
                  {contract.numero}
                  {contract.type && ` — ${contract.type}`}
                  {contract.saison && ` (${contract.saison})`}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <ContractStatusBadge status={contract.statut} />
                  <ChevronRight className="size-4 text-reca-gray-medium" aria-hidden="true" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label text-reca-gray-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  Début : {contract.dateDebut ? formatDateLong(contract.dateDebut) : '—'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  Fin : {contract.dateFin ? formatDateLong(contract.dateFin) : '—'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  Créé le : {formatDateLong(contract.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {all.length > COLLAPSED_COUNT && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="flex items-center justify-between text-label font-medium text-reca-red hover:underline"
        >
          Voir tous les contrats ({all.length})
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </Card>
  )
}
