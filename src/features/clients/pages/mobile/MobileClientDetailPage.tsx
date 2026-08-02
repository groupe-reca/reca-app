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

export function MobileClientDetailPage() {
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
    <div className="flex flex-col p-4">
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
              // `<main>` de `MobileAppShell` sans padding → `top-0` fige au vrai sommet ; marges
              // négatives pour couvrir le `p-4` de cette page.
              stickyClassName="top-0 -mx-4 -mt-4 px-4 pt-4"
            >
              {(activeTab) => (
                <>
                  {activeTab === 'informations' && (
                    <div className="flex flex-col gap-4">
                      <LocationMap
                        latitude={clientData.latitude}
                        longitude={clientData.longitude}
                        className="h-56 w-full"
                        onLocate={() => setEditOpen(true)}
                      />
                      <ClientContactCard client={clientData} />
                      <ClientInfoCard client={clientData} />
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
    </div>
  )
}
