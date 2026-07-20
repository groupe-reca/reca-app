import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { useClient } from '@/features/clients/hooks/useClient'
import { useContractInvoices } from '@/features/invoices/hooks/useContractInvoices'
import { usePaymentsByContract } from '@/features/payments/hooks/usePaymentsByContract'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { toast } from '@/stores/toastStore'
import { ContractFormModal } from '../../components/ContractFormModal'
import { ContractDetailHeader } from '../../components/detail/ContractDetailHeader'
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

/** Refonte complète (tâche 9, restyle maquette v2) — mêmes composants `detail/` que la version Mobile, seule la composition en grille change. */
export function DesktopContractDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: contract, isLoading, isError } = useContract(id)
  const { data: zoneRows } = useContractZones(id)
  const { data: invoices } = useContractInvoices(id)
  const { data: payments } = usePaymentsByContract(id)
  const { data: settings } = useSettings()
  const { data: fullClient } = useClient(contract?.clientId ?? '')
  const zones = (zoneRows ?? []).map(mapZoneRowToFormValues)
  const imageUrl = useSignedCaptureUrl(zones[0]?.imageStoragePath)
  const updateStatus = useUpdateContractStatus(id)
  const deleteContract = useDeleteContract()
  const logEvent = useLogContractEvent(id)
  const [editOpen, setEditOpen] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  function handleEmailPlaceholder() {
    logEvent.mutate({ type: 'courriel_envoye' })
    toast.success('Cette fonctionnalité arrive au prochain sprint.')
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
          <div className="flex flex-col gap-6">
            <ContractDetailHeader
              contract={contractData}
              onEdit={() => setEditOpen(true)}
              onEmail={handleEmailPlaceholder}
              onDownloadPdf={handleDownloadPdf}
              onCancelContract={handleCancelContract}
              onChangeStatus={(status) => updateStatus.mutate(status)}
              onDelete={handleDelete}
              onResumeDraft={() => navigate(`/contracts/new?draftId=${contractData.id}`)}
              isCancelling={updateStatus.isPending}
              isDownloadingPdf={isDownloadingPdf}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ContractInfoStrip contract={contractData} />
              <ContractClientCard client={contractData.client} />
              <ContractMapCard zones={zones} />
            </div>
            <ContractPaymentsCard contract={contractData} invoices={invoices ?? []} payments={payments ?? []} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ContractNotesCard contractId={contractData.id} />
              <ContractOperatorInfoCard contract={contractData} />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ContractClausesCard contract={contractData} />
              <ContractHistoryCard contractId={contractData.id} />
            </div>
            <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contractData} />
          </div>
        )
      }}
    </QueryState>
  )
}
