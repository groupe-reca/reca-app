import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUpdateInterventionNote } from '../../hooks/useUpdateInterventionNote'
import { interventionNoteSchema } from '../../schemas/interventionNote.schema'
import type { InterventionNoteFormValues } from '../../schemas/interventionNote.schema'
import type { InterventionNote } from '../../types/interventionNote.types'

type InterventionEditNoteModalProps = {
  open: boolean
  onClose: () => void
  interventionId: string
  note: InterventionNote
}

export function InterventionEditNoteModal({ open, onClose, interventionId, note }: InterventionEditNoteModalProps) {
  const updateNote = useUpdateInterventionNote(interventionId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterventionNoteFormValues>({
    resolver: zodResolver(interventionNoteSchema),
    defaultValues: { message: note.message },
  })

  function handleFormSubmit(values: InterventionNoteFormValues) {
    updateNote.mutate({ id: note.id, message: values.message }, { onSuccess: onClose })
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier la note">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <textarea
          rows={4}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('message')}
        />
        {errors.message && <p className="text-label text-red-600">{errors.message.message}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={updateNote.isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
