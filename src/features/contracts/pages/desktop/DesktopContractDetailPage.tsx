import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { useContractInvoices } from '@/features/invoices/hooks/useContractInvoices'
import { usePaymentsByContract } from '@/features/payments/hooks/usePaymentsByContract'
import { toast } from '@/stores/toastStore'
import { ContractFormModal } from '../../components/ContractFormModal'
import { ContractDetailHeader } from '../../components/detail/ContractDetailHeader'
import { ContractInfoStrip } from '../../components/detail/ContractInfoStrip'
import { ContractMapCard } from '../../components/detail/ContractMapCard'
import { ContractZonesStatRow } from '../../components/detail/ContractZonesStatRow'
import { ContractOperatorInfoCard } from '../../components/detail/ContractOperatorInfoCard'
import { ContractClausesCard } from '../../components/detail/ContractClausesCard'
import { ContractClientCard } from '../../components/detail/ContractClientCard'
import { ContractPaymentsCard } from '../../components/detail/ContractPaymentsCard'
import { ContractNotesCard } from '../../components/detail/ContractNotesCard'
import { useContract } from '../../hooks/useContract'
import { useContractZones } from '../../hooks/useContractZones'
import { useDeleteContract } from '../../hooks/useDeleteContract'
import { useUpdateContractStatus } from '../../hooks/useUpdateContractStatus'
import { mapZoneRowToFormValues } from '../../services/contracts.service'

/** Refonte complète (tâche 9) — mêmes composants `detail/` que la version Mobile, seule la composition en grille change. */
export function DesktopContractDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: contract, isLoading, isError } = useContract(id)
  const { data: zoneRows } = useContractZones(id)
  const { data: invoices } = useContractInvoices(id)
  const { data: payments } = usePaymentsByContract(id)
  const updateStatus = useUpdateContractStatus(id)
  const deleteContract = useDeleteContract()
  const [editOpen, setEditOpen] = useState(false)

  function handlePlaceholder() {
    toast.success('Cette fonctionnalité arrive au prochain sprint.')
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
        const zones = (zoneRows ?? []).map(mapZoneRowToFormValues)
        return (
          <div className="flex flex-col gap-6">
            <ContractDetailHeader
              contract={contractData}
              onEdit={() => setEditOpen(true)}
              onEmail={handlePlaceholder}
              onDownloadPdf={handlePlaceholder}
              onCancelContract={handleCancelContract}
              onChangeStatus={(status) => updateStatus.mutate(status)}
              onDelete={handleDelete}
              onResumeDraft={() => navigate(`/contracts/new?draftId=${contractData.id}`)}
              isCancelling={updateStatus.isPending}
            />
            <ContractInfoStrip contract={contractData} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <ContractMapCard zones={zones} />
                <ContractZonesStatRow zones={zones} onEditZones={handlePlaceholder} />
                <ContractOperatorInfoCard contract={contractData} />
                <ContractClausesCard contract={contractData} />
              </div>
              <div className="flex flex-col gap-6">
                <ContractClientCard client={contractData.client} />
                <ContractPaymentsCard contract={contractData} invoices={invoices ?? []} payments={payments ?? []} />
                <ContractNotesCard contractId={contractData.id} />
              </div>
            </div>
            <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contractData} />
          </div>
        )
      }}
    </QueryState>
  )
}
