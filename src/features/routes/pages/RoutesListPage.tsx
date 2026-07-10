import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RouteFormModal } from '../components/RouteFormModal'
import { RouteTable } from '../components/RouteTable'
import { useRoutes } from '../hooks/useRoutes'

export function RoutesListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: routes, isLoading, isError } = useRoutes()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Routes</h1>
          <p className="text-body text-reca-gray-medium">Tournées de déneigement.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle route
        </Button>
      </div>

      <RouteTable routes={routes} isLoading={isLoading} isError={isError} />

      <RouteFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
