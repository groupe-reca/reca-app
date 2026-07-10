import { Modal } from '@/components/ui/Modal'
import { useCreateClient } from '../hooks/useCreateClient'
import { useUpdateClient } from '../hooks/useUpdateClient'
import { ClientForm } from './ClientForm'
import type { ClientFormValues } from '../schemas/client.schema'
import type { Client } from '../types/client.types'

type ClientFormModalProps = {
  open: boolean
  onClose: () => void
  client?: Client
  initialValues?: Partial<ClientFormValues>
  onCreated?: (client: Client) => void
}

export function ClientFormModal({ open, onClose, client, initialValues, onCreated }: ClientFormModalProps) {
  const createClient = useCreateClient()
  const updateClient = useUpdateClient(client?.id ?? '')
  const isEditing = Boolean(client)

  function handleSubmit(values: ClientFormValues) {
    if (isEditing && client) {
      updateClient.mutate(values, { onSuccess: onClose })
    } else {
      createClient.mutate(values, {
        onSuccess: (created) => {
          onClose()
          onCreated?.(created)
        },
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier le client' : 'Nouveau client'}>
      <ClientForm
        client={client}
        initialValues={initialValues}
        isSubmitting={isEditing ? updateClient.isPending : createClient.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
