import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useCreateRoute } from '../hooks/useCreateRoute'
import { RouteForm } from '../components/RouteForm'

export function RouteCreatePage() {
  const navigate = useNavigate()
  const createRoute = useCreateRoute()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-section font-semibold text-reca-black">Nouvelle route</h1>
      <Card>
        <RouteForm
          isSubmitting={createRoute.isPending}
          onSubmit={(values) =>
            createRoute.mutate(values, { onSuccess: (route) => navigate(`/routes/${route.id}`) })
          }
          onCancel={() => navigate('/routes')}
        />
      </Card>
    </div>
  )
}
