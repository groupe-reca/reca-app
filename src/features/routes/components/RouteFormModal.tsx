import { Modal } from '@/components/ui/Modal'
import { useCreateRoute } from '../hooks/useCreateRoute'
import { useUpdateRoute } from '../hooks/useUpdateRoute'
import { RouteForm } from './RouteForm'
import type { RouteFormValues } from '../schemas/route.schema'
import type { Route } from '../types/route.types'

type RouteFormModalProps = {
  open: boolean
  onClose: () => void
  route?: Route
}

export function RouteFormModal({ open, onClose, route }: RouteFormModalProps) {
  const createRoute = useCreateRoute()
  const updateRoute = useUpdateRoute(route?.id ?? '')
  const isEditing = Boolean(route)

  function handleSubmit(values: RouteFormValues) {
    if (isEditing && route) {
      updateRoute.mutate(values, { onSuccess: onClose })
    } else {
      createRoute.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier la route' : 'Nouvelle route'}>
      <RouteForm
        route={route}
        isSubmitting={isEditing ? updateRoute.isPending : createRoute.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
