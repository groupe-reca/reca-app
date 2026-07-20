import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUpdateClientNote } from '../../hooks/useUpdateClientNote'
import { clientNoteSchema } from '../../schemas/clientNote.schema'
import type { ClientNoteFormValues } from '../../schemas/clientNote.schema'
import type { ClientNote } from '../../types/clientNote.types'

type ClientEditNoteModalProps = {
  open: boolean
  onClose: () => void
  clientId: string
  note: ClientNote
}

export function ClientEditNoteModal({ open, onClose, clientId, note }: ClientEditNoteModalProps) {
  const updateNote = useUpdateClientNote(clientId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientNoteFormValues>({
    resolver: zodResolver(clientNoteSchema),
    defaultValues: { message: note.message },
  })

  function handleFormSubmit(values: ClientNoteFormValues) {
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
