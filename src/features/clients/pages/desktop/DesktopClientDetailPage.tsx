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

/** Restyle complet (reproduction de maquette) — mêmes composants `detail/` que la version Mobile, seule la composition en grille change. */
export function DesktopClientDetailPage() {
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
    <QueryState isLoading={isLoading} isError={isError} data={client} errorLabel="Impossible de charger ce client.">
      {(clientData) => (
        <div className="flex flex-col gap-6">
          <ClientDetailHeader
            client={clientData}
            onEdit={() => setEditOpen(true)}
            onDelete={handleDelete}
            isDeleting={deleteClient.isPending}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ClientContactCard client={clientData} />
            <ClientInfoCard client={clientData} />
          </div>
          <ClientContractsCard clientId={clientData.id} />
          <ClientNotesCard clientId={clientData.id} />
          <ClientInvoicesCard clientId={clientData.id} />
          <ClientFormModal open={editOpen} onClose={() => setEditOpen(false)} client={clientData} />
        </div>
      )}
    </QueryState>
  )
}
