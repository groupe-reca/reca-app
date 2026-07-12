import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { FileSignature, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { useClients } from '@/features/clients/hooks/useClients'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { InvoiceForm } from '../components/InvoiceForm'
import { useCreateInvoice } from '../hooks/useCreateInvoice'

export function InvoiceCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''
  const preselectedContratId = searchParams.get('contratId') ?? ''
  const needsClientPicker = !preselectedClientId

  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedContratId, setSelectedContratId] = useState(preselectedContratId)
  const { data: clients } = useClients()

  const effectiveClientId = preselectedClientId || selectedClientId
  const { data: contracts } = useClientContracts(effectiveClientId)
  const createInvoice = useCreateInvoice(effectiveClientId, selectedContratId || undefined)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvelle facture</h1>
        <p className="text-body text-reca-gray-medium">Facturez un client, avec ou sans contrat associé.</p>
      </div>

      <Card>
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
          {!preselectedContratId && effectiveClientId && (
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
            isSubmitting={createInvoice.isPending}
            disabled={needsClientPicker && !selectedClientId}
            onSubmit={(values) =>
              createInvoice.mutate(values, { onSuccess: (created) => navigate(`/invoices/${created.id}`) })
            }
            onCancel={() => navigate(preselectedClientId ? `/clients/${preselectedClientId}` : '/invoices')}
          />
        </div>
      </Card>
    </div>
  )
}
