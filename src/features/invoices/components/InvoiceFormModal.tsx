import { useState } from 'react'
import { FileSignature, Users } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useClients } from '@/features/clients/hooks/useClients'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { useCreateInvoice } from '../hooks/useCreateInvoice'
import { useUpdateInvoice } from '../hooks/useUpdateInvoice'
import { InvoiceForm } from './InvoiceForm'
import type { InvoiceFormValues } from '../schemas/invoice.schema'
import type { Invoice } from '../types/invoice.types'

type InvoiceFormModalProps = {
  open: boolean
  onClose: () => void
  invoice?: Invoice
  clientId?: string
  contratId?: string
  onCreated?: (invoice: Invoice) => void
}

export function InvoiceFormModal({
  open,
  onClose,
  invoice,
  clientId,
  contratId,
  onCreated,
}: InvoiceFormModalProps) {
  const isEditing = Boolean(invoice)
  const needsClientPicker = !isEditing && !clientId
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedContratId, setSelectedContratId] = useState(contratId ?? '')
  const { data: clients } = useClients()

  const effectiveClientId = clientId ?? selectedClientId
  const { data: contracts } = useClientContracts(effectiveClientId)
  const createInvoice = useCreateInvoice(effectiveClientId, selectedContratId || undefined)
  const updateInvoice = useUpdateInvoice(invoice?.id ?? '')

  function handleSubmit(values: InvoiceFormValues) {
    if (isEditing && invoice) {
      updateInvoice.mutate(values, { onSuccess: onClose })
      return
    }
    if (!effectiveClientId) return
    createInvoice.mutate(values, {
      onSuccess: (created) => {
        onClose()
        onCreated?.(created)
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier la facture' : 'Nouvelle facture'}>
      <div className="flex flex-col gap-4">
        {needsClientPicker && (
          <Select
            label="Client"
            icon={Users}
            value={selectedClientId}
            onChange={(event) => {
              setSelectedClientId(event.target.value)
              setSelectedContratId('')
            }}
          >
            <option value="">Sélectionner un client</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.prenom} {client.nom} ({client.numero})
              </option>
            ))}
          </Select>
        )}
        {!isEditing && !contratId && effectiveClientId && (
          <Select
            label="Contrat (optionnel)"
            icon={FileSignature}
            value={selectedContratId}
            onChange={(event) => setSelectedContratId(event.target.value)}
          >
            <option value="">Aucun contrat</option>
            {contracts?.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.numero} {contract.type ? `— ${contract.type}` : ''}
              </option>
            ))}
          </Select>
        )}
        <InvoiceForm
          invoice={invoice}
          isSubmitting={isEditing ? updateInvoice.isPending : createInvoice.isPending}
          disabled={needsClientPicker && !selectedClientId}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </div>
    </Modal>
  )
}
