import { Modal } from '@/components/ui/Modal'
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

  function handleSubmit(values: ContractFormValues) {
    updateContract.mutate(values, { onSuccess: onClose })
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
