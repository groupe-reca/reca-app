import { useState } from 'react'
import { Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useClients } from '@/features/clients/hooks/useClients'
import { useCreateContract } from '../hooks/useCreateContract'
import { useUpdateContract } from '../hooks/useUpdateContract'
import { ContractForm } from './ContractForm'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { Contract } from '../types/contract.types'

type ContractFormModalProps = {
  open: boolean
  onClose: () => void
  contract?: Contract
  clientId?: string
  onCreated?: (contract: Contract) => void
}

export function ContractFormModal({ open, onClose, contract, clientId, onCreated }: ContractFormModalProps) {
  const isEditing = Boolean(contract)
  const needsClientPicker = !isEditing && !clientId
  const [selectedClientId, setSelectedClientId] = useState('')
  const { data: clients } = useClients()

  const effectiveClientId = clientId ?? selectedClientId
  const createContract = useCreateContract(effectiveClientId)
  const updateContract = useUpdateContract(contract?.id ?? '')

  function handleSubmit(values: ContractFormValues) {
    if (isEditing && contract) {
      updateContract.mutate(values, { onSuccess: onClose })
      return
    }
    if (!effectiveClientId) return
    createContract.mutate(values, {
      onSuccess: (created) => {
        onClose()
        onCreated?.(created)
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier le contrat' : 'Nouveau contrat'}>
      <div className="flex flex-col gap-4">
        {needsClientPicker && (
          <Select
            label="Client"
            icon={Users}
            value={selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
          >
            <option value="">Sélectionner un client</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.prenom} {client.nom} ({client.numero})
              </option>
            ))}
          </Select>
        )}
        <ContractForm
          contract={contract}
          isSubmitting={isEditing ? updateContract.isPending : createContract.isPending}
          disabled={needsClientPicker && !selectedClientId}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  )
}
