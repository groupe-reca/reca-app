import { Modal } from '@/components/ui/Modal'
import { useUpdateRoute } from '../hooks/useUpdateRoute'
import { RouteForm } from './RouteForm'
import type { Route } from '../types/route.types'

type RouteSettingsModalProps = {
  open: boolean
  onClose: () => void
  route: Route
}

/**
 * Inclut la Couleur en plus des 3 champs (Nom/Opérateur/Équipement) listés par le brief pour
 * "Paramètres" — aucun autre endroit ne permet d'éditer la couleur après création.
 */
export function RouteSettingsModal({ open, onClose, route }: RouteSettingsModalProps) {
  const updateRoute = useUpdateRoute(route.id)

  return (
    <Modal open={open} onClose={onClose} title="Paramètres de la route">
      <RouteForm
        route={route}
        isSubmitting={updateRoute.isPending}
        onSubmit={(values) => updateRoute.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
