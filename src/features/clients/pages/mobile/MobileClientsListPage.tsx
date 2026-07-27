import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileClientLayout } from '../../components/mobile/MobileClientLayout'
import { ClientsListContent } from '../../components/ClientsListContent'
import { useClients } from '../../hooks/useClients'

export function MobileClientsListPage() {
  const navigate = useNavigate()
  const { data: clients, isLoading, isError } = useClients()

  return (
    <MobileClientLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/clients/new')}
          aria-label="Nouveau client"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <ClientsListContent clients={clients} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileClientLayout>
  )
}
