import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Mail, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ContractFormModal } from '@/features/contracts/components/ContractFormModal'
import { ContractStatusBadge } from '@/features/contracts/components/ContractStatusBadge'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { useClient } from '../hooks/useClient'
import { useDeleteClient } from '../hooks/useDeleteClient'
import { ClientFormModal } from '../components/ClientFormModal'

export function ClientDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: client, isLoading } = useClient(id)
  const deleteClient = useDeleteClient()
  const { data: contracts } = useClientContracts(id)
  const [editOpen, setEditOpen] = useState(false)
  const [contractModalOpen, setContractModalOpen] = useState(false)

  if (isLoading || !client) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!client) return
    if (!window.confirm(`Supprimer le client ${client.numero} ?`)) return
    deleteClient.mutate(client.id, { onSuccess: () => navigate('/clients') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{client.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">
            {client.prenom} {client.nom}
          </h1>
          {client.entreprise && <p className="text-body text-reca-gray-medium">{client.entreprise}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Coordonnées</h2>
          <div className="flex flex-col gap-2 text-body">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {client.telephone ? (
                <a href={`tel:${client.telephone}`} className="text-reca-red hover:underline">
                  {client.telephone}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-reca-gray-medium" aria-hidden="true" />
              {client.courriel ? (
                <a href={`mailto:${client.courriel}`} className="text-reca-red hover:underline">
                  {client.courriel}
                </a>
              ) : (
                <span className="text-reca-gray-medium">—</span>
              )}
            </div>
            <p className="text-reca-gray-medium">
              {[client.adresse, client.ville, client.codePostal].filter(Boolean).join(', ') ||
                'Adresse non renseignée'}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Type : {client.typeClient ?? '—'}</p>
            <p>
              GPS :{' '}
              {client.latitude && client.longitude ? `${client.latitude}, ${client.longitude}` : '—'}
            </p>
            <p>Notes : {client.notes ?? '—'}</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-subtitle font-semibold text-reca-black">Contrats</h2>
          <Button variant="secondary" onClick={() => setContractModalOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Créer un contrat
          </Button>
        </div>
        {contracts && contracts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                to={`/contracts/${contract.id}`}
                className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3 hover:bg-reca-snow"
              >
                <div className="text-body text-reca-black">
                  <span className="font-medium">{contract.numero}</span>
                  {contract.type && <span className="text-reca-gray-medium"> — {contract.type}</span>}
                  {contract.saison && <span className="text-reca-gray-medium"> ({contract.saison})</span>}
                </div>
                <ContractStatusBadge status={contract.statut} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-body text-reca-gray-medium">Aucun contrat pour ce client.</p>
        )}
      </Card>

      <ClientFormModal open={editOpen} onClose={() => setEditOpen(false)} client={client} />

      <ContractFormModal
        open={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        clientId={client.id}
      />
    </div>
  )
}
