import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUpdateMissionNote } from '../../hooks/useUpdateMissionNote'
import { missionNoteSchema } from '../../schemas/missionNote.schema'
import type { MissionNoteFormValues } from '../../schemas/missionNote.schema'
import type { MissionNote } from '../../types/missionNote.types'

type MissionEditNoteModalProps = {
  open: boolean
  onClose: () => void
  missionId: string
  note: MissionNote
}

export function MissionEditNoteModal({ open, onClose, missionId, note }: MissionEditNoteModalProps) {
  const updateNote = useUpdateMissionNote(missionId)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MissionNoteFormValues>({
    resolver: zodResolver(missionNoteSchema),
    defaultValues: { message: note.message },
  })

  function handleFormSubmit(values: MissionNoteFormValues) {
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
