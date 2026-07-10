import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { formatCurrency } from '@/lib/format'
import { useContract } from '../hooks/useContract'
import { useDeleteContract } from '../hooks/useDeleteContract'
import { useUpdateContractStatus } from '../hooks/useUpdateContractStatus'
import { ContractFormModal } from '../components/ContractFormModal'
import { ContractStatusBadge } from '../components/ContractStatusBadge'
import { CONTRACT_STATUSES, CONTRACT_STATUS_LABELS } from '../types/contract.types'

export function ContractDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: contract, isLoading } = useContract(id)
  const updateStatus = useUpdateContractStatus(id)
  const deleteContract = useDeleteContract()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !contract) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!contract) return
    if (!window.confirm(`Supprimer le contrat ${contract.numero} ?`)) return
    deleteContract.mutate(contract.id, { onSuccess: () => navigate('/contracts') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{contract.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">
            {contract.type ?? 'Contrat'} {contract.saison ? `— ${contract.saison}` : ''}
          </h1>
          <div className="mt-2">
            <ContractStatusBadge status={contract.statut} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {CONTRACT_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {CONTRACT_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Prix : {contract.prix != null ? formatCurrency(contract.prix) : '—'}</p>
            <p>Signature : {contract.dateSignature ?? '—'}</p>
            <p>Début : {contract.dateDebut ?? '—'}</p>
            <p>Fin : {contract.dateFin ?? '—'}</p>
            <p>Renouvellement automatique : {contract.renouvellement ? 'Oui' : 'Non'}</p>
            <p>Notes : {contract.notes ?? '—'}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client</h2>
          {contract.client ? (
            <p className="text-body text-reca-gray-medium">
              <Link to={`/clients/${contract.client.id}`} className="text-reca-red hover:underline">
                {contract.client.prenom} {contract.client.nom} ({contract.client.numero})
              </Link>
            </p>
          ) : (
            <p className="text-body text-reca-gray-medium">Aucun client associé.</p>
          )}
        </Card>
      </div>

      <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contract} />
    </div>
  )
}
