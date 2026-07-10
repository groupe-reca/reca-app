import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ClientFormModal } from '../components/ClientFormModal'
import { ClientTable } from '../components/ClientTable'
import { useClients } from '../hooks/useClients'

export function ClientsListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: clients, isLoading, isError } = useClients()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Clients</h1>
          <p className="text-body text-reca-gray-medium">Fiches clients actives.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau client
        </Button>
      </div>

      <ClientTable clients={clients} isLoading={isLoading} isError={isError} />

      <ClientFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
