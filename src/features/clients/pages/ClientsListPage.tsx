import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ClientTable } from '../components/ClientTable'
import { useClients } from '../hooks/useClients'

export function ClientsListPage() {
  const navigate = useNavigate()
  const { data: clients, isLoading, isError } = useClients()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Clients</h1>
          <p className="text-body text-reca-gray-medium">Fiches clients actives.</p>
        </div>
        <Button onClick={() => navigate('/clients/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouveau client
        </Button>
      </div>

      <ClientTable clients={clients} isLoading={isLoading} isError={isError} />
    </div>
  )
}
