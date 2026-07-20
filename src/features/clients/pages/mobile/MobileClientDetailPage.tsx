import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { ClientFormModal } from '../../components/ClientFormModal'
import { ClientDetailHeader } from '../../components/detail/ClientDetailHeader'
import { ClientContactCard } from '../../components/detail/ClientContactCard'
import { ClientInfoCard } from '../../components/detail/ClientInfoCard'
import { ClientContractsCard } from '../../components/detail/ClientContractsCard'
import { ClientNotesCard } from '../../components/detail/ClientNotesCard'
import { ClientInvoicesCard } from '../../components/detail/ClientInvoicesCard'
import { useClient } from '../../hooks/useClient'
import { useDeleteClient } from '../../hooks/useDeleteClient'

/** Ordre identique à la maquette : En-tête → Coordonnées → Détails du client → Contrats → Notes du client. */
export function MobileClientDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: client, isLoading, isError } = useClient(id)
  const deleteClient = useDeleteClient()
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    if (!client) return
    if (!window.confirm(`Supprimer le client ${client.numero} ?`)) return
    deleteClient.mutate(client.id, { onSuccess: () => navigate('/clients') })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <QueryState isLoading={isLoading} isError={isError} data={client} errorLabel="Impossible de charger ce client.">
        {(clientData) => (
          <>
            <ClientDetailHeader
              client={clientData}
              onEdit={() => setEditOpen(true)}
              onDelete={handleDelete}
              isDeleting={deleteClient.isPending}
            />
            <ClientContactCard client={clientData} />
            <ClientInfoCard client={clientData} />
            <ClientContractsCard clientId={clientData.id} />
            <ClientNotesCard clientId={clientData.id} />
            <ClientInvoicesCard clientId={clientData.id} />
            <ClientFormModal open={editOpen} onClose={() => setEditOpen(false)} client={clientData} />
          </>
        )}
      </QueryState>
    </div>
  )
}
