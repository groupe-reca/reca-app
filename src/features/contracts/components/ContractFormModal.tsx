import { Modal } from '@/components/ui/Modal'
import { useLogContractEvent } from '../hooks/useLogContractEvent'
import { useUpdateContract } from '../hooks/useUpdateContract'
import { ContractForm } from './ContractForm'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { Contract } from '../types/contract.types'

type ContractFormModalProps = {
  open: boolean
  onClose: () => void
  contract: Contract
}

export function ContractFormModal({ open, onClose, contract }: ContractFormModalProps) {
  const updateContract = useUpdateContract(contract.id)
  const logEvent = useLogContractEvent(contract.id)

  function handleSubmit(values: ContractFormValues) {
    // Seul moment réel où une signature est enregistrée : le Wizard ne collecte
    // plus `dateSignature` depuis la tâche 5, seule cette édition la fixe.
    const signatureChanged = Boolean(values.dateSignature) && values.dateSignature !== (contract.dateSignature ?? '')
    updateContract.mutate(values, {
      onSuccess: () => {
        if (signatureChanged) logEvent.mutate({ type: 'contrat_signe' })
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le contrat">
      <ContractForm
        contract={contract}
        isSubmitting={updateContract.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
