import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { SendEmailModal } from '@/components/email/SendEmailModal'
import { useClient } from '@/features/clients/hooks/useClient'
import { useContractInvoices } from '@/features/invoices/hooks/useContractInvoices'
import { usePaymentsByContract } from '@/features/payments/hooks/usePaymentsByContract'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { useBreadcrumbLabel } from '@/layouts/useBreadcrumbLabel'
import { toast } from '@/stores/toastStore'
import { ContractFormModal } from '../../components/ContractFormModal'
import { ContractDetailHeader } from '../../components/detail/ContractDetailHeader'
import { ContractDetailTabsShell } from '../../components/detail/ContractDetailTabsShell'
import { ContractStatsBanner } from '../../components/detail/ContractStatsBanner'
import { ContractInfoStrip } from '../../components/detail/ContractInfoStrip'
import { ContractMapCard } from '../../components/detail/ContractMapCard'
import { ContractOperatorInfoCard } from '../../components/detail/ContractOperatorInfoCard'
import { ContractClausesCard } from '../../components/detail/ContractClausesCard'
import { ContractClientCard } from '../../components/detail/ContractClientCard'
import { ContractPaymentsCard } from '../../components/detail/ContractPaymentsCard'
import { ContractNotesCard } from '../../components/detail/ContractNotesCard'
import { ContractHistoryCard } from '../../components/detail/ContractHistoryCard'
import { useContract } from '../../hooks/useContract'
import { useContractZones } from '../../hooks/useContractZones'
import { useDeleteContract } from '../../hooks/useDeleteContract'
import { useLogContractEvent } from '../../hooks/useLogContractEvent'
import { useSignedCaptureUrl } from '../../hooks/useSignedCaptureUrl'
import { useUpdateContractStatus } from '../../hooks/useUpdateContractStatus'
import { mapZoneRowToFormValues } from '../../services/contracts.service'

/**
 * Mêmes composants `detail/` que la version Mobile, seule la composition en grille change.
 * Depuis la refonte en onglets, les cartes sont réparties en 5 onglets sous un en-tête
 * collant (voir `ContractDetailTabsShell`) au lieu d'une pile de trois écrans de défilement.
 */
export function DesktopContractDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: contract, isLoading, isError } = useContract(id)
  const { data: zoneRows } = useContractZones(id)
  const { data: invoices } = useContractInvoices(id)
  const { data: payments } = usePaymentsByContract(id)
  const { data: settings } = useSettings()
  const { data: fullClient } = useClient(contract?.clientId ?? '')
  // Fil d'Ariane : remplace le libellé statique 'Détail' de la route par le numéro réel.
  useBreadcrumbLabel(contract?.numero)
  const zones = (zoneRows ?? []).map(mapZoneRowToFormValues)
  const imageUrl = useSignedCaptureUrl(zones[0]?.imageStoragePath)
  const updateStatus = useUpdateContractStatus(id)
  const deleteContract = useDeleteContract()
  const logEvent = useLogContractEvent(id)
  const [editOpen, setEditOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  function handleOpenEmail() {
    if (!contract || !settings || !fullClient) return
    setEmailOpen(true)
  }

  async function handleDownloadPdf() {
    if (!contract || !settings || !fullClient) return
    setIsDownloadingPdf(true)
    try {
      const { generateContractPdf } = await import('../../pdf/generateContractPdf')
      await generateContractPdf({ contract, client: fullClient, zones, settings, imageUrl })
      logEvent.mutate({ type: 'pdf_genere' })
    } catch {
      toast.error('Impossible de générer le PDF du contrat.')
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  function handleDelete() {
    if (!contract) return
    if (!window.confirm(`Supprimer le contrat ${contract.numero} ?`)) return
    deleteContract.mutate(contract.id, { onSuccess: () => navigate('/contracts') })
  }

  function handleCancelContract() {
    if (!contract) return
    if (!window.confirm(`Annuler le contrat ${contract.numero} ?`)) return
    updateStatus.mutate('annule')
  }

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={contract}
      errorLabel="Impossible de charger ce contrat."
    >
      {(contractData) => {
        return (
          <>
            <ContractDetailTabsShell
              // Le `<main>` de `DesktopAppShell` est le conteneur de scroll et porte
              // `p-4 sm:p-6 lg:p-8`. Les marges négatives (+ padding équivalent) étendent le
              // bloc collant bord à bord ; le `top` **négatif** de la même valeur le fige au
              // vrai sommet du `<main>` — un `top-0` le figerait sous le padding, laissant le
              // contenu défiler dans la bande au-dessus de l'en-tête.
              stickyClassName="-top-4 -mx-4 -mt-4 px-4 pt-4 sm:-top-6 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6 lg:-top-8 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8"
              header={
                <ContractDetailHeader
                  contract={contractData}
                  clientName={
                    contractData.client
                      ? `${contractData.client.prenom} ${contractData.client.nom}`.trim()
                      : null
                  }
                  onEdit={() => setEditOpen(true)}
                  onEmail={handleOpenEmail}
                  onDownloadPdf={handleDownloadPdf}
                  onCancelContract={handleCancelContract}
                  onChangeStatus={(status) => updateStatus.mutate(status)}
                  onDelete={handleDelete}
                  onResumeDraft={() => navigate(`/contracts/new?draftId=${contractData.id}`)}
                  isCancelling={updateStatus.isPending}
                  isDownloadingPdf={isDownloadingPdf}
                />
              }
            >
              {(activeTab) => (
                <>
                  {activeTab === 'resume' && (
                    <div className="flex flex-col gap-6">
                      <ContractStatsBanner contract={contractData} zones={zones} />
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <ContractInfoStrip contract={contractData} onEdit={() => setEditOpen(true)} />
                        <ContractClientCard client={contractData.client} />
                        <ContractNotesCard contractId={contractData.id} />
                      </div>
                    </div>
                  )}
                  {activeTab === 'site' && (
                    <div className="flex flex-col gap-6">
                      <ContractMapCard zones={zones} />
                      <ContractOperatorInfoCard contract={contractData} />
                    </div>
                  )}
                  {activeTab === 'echeancier' && (
                    <ContractPaymentsCard
                      contract={contractData}
                      invoices={invoices ?? []}
                      payments={payments ?? []}
                    />
                  )}
                  {activeTab === 'clauses' && <ContractClausesCard contract={contractData} />}
                  {activeTab === 'historique' && <ContractHistoryCard contractId={contractData.id} />}
                </>
              )}
            </ContractDetailTabsShell>
            <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contractData} />
            <SendEmailModal
              open={emailOpen}
              onClose={() => setEmailOpen(false)}
              defaultTo={fullClient?.courriel ?? ''}
              defaultSubject={`Votre contrat ${contractData.numero} — Groupe RECA`}
              defaultMessage={`Bonjour,\n\nVeuillez trouver ci-joint votre contrat de déneigement ${contractData.numero}.\n\nMerci de faire affaire avec Groupe RECA.\n\nL'équipe Groupe RECA`}
              attachmentFilename={`Contrat-${contractData.numero}.pdf`}
              buildAttachmentBlob={async () => {
                if (!settings || !fullClient) throw new Error('Données du contrat non chargées.')
                const { buildContractPdfBlob } = await import('../../pdf/generateContractPdf')
                return buildContractPdfBlob({ contract: contractData, client: fullClient, zones, settings, imageUrl })
              }}
              onSent={() => logEvent.mutate({ type: 'courriel_envoye' })}
            />
          </>
        )
      }}
    </QueryState>
  )
}
