import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AtSign, Type as TypeIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { sendEmail } from '@/lib/email.service'
import { toast } from '@/stores/toastStore'

const sendEmailSchema = z.object({
  to: z.string().min(1, 'Le courriel est requis').email('Courriel invalide'),
  subject: z.string().min(1, "L'objet est requis"),
  message: z.string().min(1, 'Le message est requis'),
})

type SendEmailFormValues = z.infer<typeof sendEmailSchema>

type SendEmailModalProps = {
  open: boolean
  onClose: () => void
  defaultTo: string
  defaultSubject: string
  defaultMessage: string
  attachmentFilename: string
  buildAttachmentBlob: () => Promise<Blob>
  onSent?: () => void
}

/**
 * Modale générique d'envoi de courriel (Contrats/Factures) — transverse, ni l'un ni
 * l'autre module ne se l'importent mutuellement. Le PDF joint n'est généré qu'à la
 * confirmation (`buildAttachmentBlob`, pas à l'ouverture) pour éviter un travail inutile
 * si l'utilisateur annule.
 */
export function SendEmailModal({
  open,
  onClose,
  defaultTo,
  defaultSubject,
  defaultMessage,
  attachmentFilename,
  buildAttachmentBlob,
  onSent,
}: SendEmailModalProps) {
  const [isSending, setIsSending] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendEmailFormValues>({
    resolver: zodResolver(sendEmailSchema),
  })

  useEffect(() => {
    if (open) reset({ to: defaultTo, subject: defaultSubject, message: defaultMessage })
  }, [open, defaultTo, defaultSubject, defaultMessage, reset])

  async function handleFormSubmit(values: SendEmailFormValues) {
    setIsSending(true)
    try {
      const blob = await buildAttachmentBlob()
      await sendEmail({
        to: values.to,
        subject: values.subject,
        message: values.message,
        attachment: { filename: attachmentFilename, blob },
      })
      toast.success('Courriel envoyé.')
      onSent?.()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de l'envoi du courriel.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Envoyer par courriel">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
        <Input label="Destinataire" icon={AtSign} type="email" error={errors.to?.message} {...register('to')} />
        <Input label="Objet" icon={TypeIcon} error={errors.subject?.message} {...register('subject')} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="send-email-message" className="text-label font-medium text-reca-gray-medium">
            Message
          </label>
          <textarea
            id="send-email-message"
            rows={6}
            className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('message')}
          />
          {errors.message && <p className="text-label text-red-600">{errors.message.message}</p>}
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isSending}>
            Envoyer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
