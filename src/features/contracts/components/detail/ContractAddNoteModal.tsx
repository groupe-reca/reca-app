import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAddContractNote } from '../../hooks/useAddContractNote'
import { contractNoteSchema } from '../../schemas/contractNote.schema'
import type { ContractNoteFormValues } from '../../schemas/contractNote.schema'

type ContractAddNoteModalProps = {
  open: boolean
  onClose: () => void
  contractId: string
}

export function ContractAddNoteModal({ open, onClose, contractId }: ContractAddNoteModalProps) {
  const addNote = useAddContractNote(contractId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractNoteFormValues>({
    resolver: zodResolver(contractNoteSchema),
  })

  function handleFormSubmit(values: ContractNoteFormValues) {
    addNote.mutate(values.message, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une note">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <textarea
          rows={4}
          placeholder="Écrire une note au dossier..."
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('message')}
        />
        {errors.message && <p className="text-label text-red-600">{errors.message.message}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={addNote.isPending}>
            Ajouter la note
          </Button>
        </div>
      </form>
    </Modal>
  )
}
