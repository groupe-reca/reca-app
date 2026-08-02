import { useState } from 'react'
import { FolderOpen, History } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { LocationMap } from '@/components/ui/LocationMap'
import { QueryState } from '@/components/ui/QueryState'
import { ClientFormModal } from '../../components/ClientFormModal'
import { ClientDetailHeader } from '../../components/detail/ClientDetailHeader'
import { ClientDetailTabsShell } from '../../components/detail/ClientDetailTabsShell'
import { ClientContactCard } from '../../components/detail/ClientContactCard'
import { ClientInfoCard } from '../../components/detail/ClientInfoCard'
import { ClientContractsCard } from '../../components/detail/ClientContractsCard'
import { ClientNotesCard } from '../../components/detail/ClientNotesCard'
import { ClientInvoicesCard } from '../../components/detail/ClientInvoicesCard'
import { ClientPlaceholderTab } from '../../components/detail/ClientPlaceholderTab'
import { useClient } from '../../hooks/useClient'
import { useDeleteClient } from '../../hooks/useDeleteClient'
import type { Client } from '../../types/client.types'

export function DesktopClientDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: client, isLoading, isError } = useClient(id)
  const deleteClient = useDeleteClient()
  const [editOpen, setEditOpen] = useState(false)

  function handleArchive(target: Client) {
    if (
      !window.confirm(
        `Archiver le client ${target.numero} — ${target.prenom} ${target.nom} ?\n\n` +
          "Le client et son historique (contrats, factures) sont conservés mais retirés des listes actives.",
      )
    )
      return
    deleteClient.mutate(target.id, { onSuccess: () => navigate('/clients') })
  }

  return (
    <QueryState isLoading={isLoading} isError={isError} data={client} errorLabel="Impossible de charger ce client.">
      {(clientData) => (
        <>
          <ClientDetailTabsShell
            header={
              <div className="pb-4">
                <ClientDetailHeader
                  client={clientData}
                  onEdit={() => setEditOpen(true)}
                  onArchive={() => handleArchive(clientData)}
                  onCreateContract={() => navigate(`/contracts/new?clientId=${clientData.id}`)}
                  onCreateInvoice={() => navigate(`/invoices/new?clientId=${clientData.id}`)}
                  isArchiving={deleteClient.isPending}
                />
              </div>
            }
            // Voir le piège `sticky`/padding documenté sur `ContractDetailTabsShell` : le `top`
            // négatif compense le padding du `<main>` pour figer le bloc au vrai sommet.
            stickyClassName="-top-4 -mx-4 -mt-4 px-4 pt-4 sm:-top-6 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6 lg:-top-8 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8"
          >
            {(activeTab) => (
              <>
                {activeTab === 'informations' && (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                      <LocationMap
                        latitude={clientData.latitude}
                        longitude={clientData.longitude}
                        className="h-64 w-full"
                        onLocate={() => setEditOpen(true)}
                      />
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <ClientContactCard client={clientData} />
                        <ClientInfoCard client={clientData} />
                      </div>
                    </div>
                    <ClientNotesCard clientId={clientData.id} />
                  </div>
                )}
                {activeTab === 'contrats' && <ClientContractsCard clientId={clientData.id} />}
                {activeTab === 'factures' && <ClientInvoicesCard clientId={clientData.id} />}
                {activeTab === 'documents' && <ClientPlaceholderTab icon={FolderOpen} title="Documents" />}
                {activeTab === 'historique' && <ClientPlaceholderTab icon={History} title="Historique" />}
              </>
            )}
          </ClientDetailTabsShell>
          <ClientFormModal open={editOpen} onClose={() => setEditOpen(false)} client={clientData} />
        </>
      )}
    </QueryState>
  )
}
