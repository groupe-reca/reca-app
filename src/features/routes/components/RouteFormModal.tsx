import { Modal } from '@/components/ui/Modal'
import { useUpdateRoute } from '../hooks/useUpdateRoute'
import { RouteForm } from './RouteForm'
import type { Route } from '../types/route.types'

type RouteFormModalProps = {
  open: boolean
  onClose: () => void
  route: Route
}

export function RouteFormModal({ open, onClose, route }: RouteFormModalProps) {
  const updateRoute = useUpdateRoute(route.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier la route">
      <RouteForm
        route={route}
        isSubmitting={updateRoute.isPending}
        onSubmit={(values) => updateRoute.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
