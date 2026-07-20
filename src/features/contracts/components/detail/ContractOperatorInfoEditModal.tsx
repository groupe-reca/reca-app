import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUpdateContractOperatorInfo } from '../../hooks/useUpdateContractOperatorInfo'
import type { OperatorInfoPatch } from '../../hooks/useUpdateContractOperatorInfo'
import { contractOperatorInfoFieldSchema } from '../../schemas/contractOperatorInfo.schema'
import type { ContractOperatorInfoField, ContractOperatorInfoFieldValues } from '../../schemas/contractOperatorInfo.schema'
import type { ContractRow } from '../../types/contract.types'

const FIELD_TO_COLUMN: Record<ContractOperatorInfoField, keyof ContractRow> = {
  obstaclesConnus: 'obstacles_connus',
  messageOperateur: 'message_operateur',
  consignesSpeciales: 'consignes_speciales',
}

type ContractOperatorInfoEditModalProps = {
  open: boolean
  onClose: () => void
  contractId: string
  field: ContractOperatorInfoField
  label: string
  initialValue: string | null
}

export function ContractOperatorInfoEditModal({
  open,
  onClose,
  contractId,
  field,
  label,
  initialValue,
}: ContractOperatorInfoEditModalProps) {
  const updateOperatorInfo = useUpdateContractOperatorInfo(contractId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractOperatorInfoFieldValues>({
    resolver: zodResolver(contractOperatorInfoFieldSchema),
    defaultValues: { value: initialValue ?? '' },
  })

  function handleFormSubmit(values: ContractOperatorInfoFieldValues) {
    const column = FIELD_TO_COLUMN[field]
    const patch = { [column]: values.value || null } as OperatorInfoPatch
    updateOperatorInfo.mutate(patch, { onSuccess: onClose })
  }

  return (
    <Modal open={open} onClose={onClose} title={label}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <textarea
          rows={5}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('value')}
        />
        {errors.value && <p className="text-label text-red-600">{errors.value.message}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={updateOperatorInfo.isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
