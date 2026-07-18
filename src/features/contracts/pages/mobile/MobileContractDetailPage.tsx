import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { useContractInvoices } from '@/features/invoices/hooks/useContractInvoices'
import { usePaymentsByContract } from '@/features/payments/hooks/usePaymentsByContract'
import { toast } from '@/stores/toastStore'
import { MobileContractLayout } from '../../components/mobile/MobileContractLayout'
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

/**
 * Mêmes composants `detail/` que la version Desktop, empilés en 1 colonne — la carte
 * satellite reste juste après l'en-tête ("la carte satellite reste prioritaire" côté mobile).
 * Contrairement à l'ancienne page, les actions vivent désormais dans `ContractDetailHeader`
 * (boutons pleine largeur en dessous de `sm`), plus dans le slot `headerActions` de la barre du haut.
 */
export function MobileContractDetailPage() {
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
    <MobileContractLayout>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={contract}
        errorLabel="Impossible de charger ce contrat."
      >
        {(contractData) => {
          const zones = (zoneRows ?? []).map(mapZoneRowToFormValues)
          return (
            <div className="flex flex-col gap-4">
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
              <ContractMapCard zones={zones} />
              <ContractZonesStatRow zones={zones} onEditZones={handlePlaceholder} />
              <ContractInfoStrip contract={contractData} />
              <ContractClientCard client={contractData.client} />
              <ContractOperatorInfoCard contract={contractData} />
              <ContractPaymentsCard contract={contractData} invoices={invoices ?? []} payments={payments ?? []} />
              <ContractClausesCard contract={contractData} />
              <ContractNotesCard contractId={contractData.id} />
              <ContractFormModal open={editOpen} onClose={() => setEditOpen(false)} contract={contractData} />
            </div>
          )
        }}
      </QueryState>
    </MobileContractLayout>
  )
}
