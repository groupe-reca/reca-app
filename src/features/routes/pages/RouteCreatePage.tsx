import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { RouteForm } from '../components/RouteForm'
import { useCreateRoute } from '../hooks/useCreateRoute'

export function RouteCreatePage() {
  const navigate = useNavigate()
  const createRoute = useCreateRoute()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvelle route</h1>
        <p className="text-body text-reca-gray-medium">Créez une tournée de déneigement.</p>
      </div>

      <Card>
        <RouteForm
          isSubmitting={createRoute.isPending}
          onSubmit={(values) =>
            createRoute.mutate(values, { onSuccess: (created) => navigate(`/routes/${created.id}`) })
          }
          onCancel={() => navigate('/routes')}
        />
      </Card>
    </div>
  )
}
