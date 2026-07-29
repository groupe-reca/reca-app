import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useRoute } from '../../hooks/useRoute'
import { useRouteContracts } from '../../hooks/useRouteContracts'
import { useDeleteRoute } from '../../hooks/useDeleteRoute'
import { RouteDetailHeader } from '../../components/detail/RouteDetailHeader'
import { RouteActionBar } from '../../components/detail/RouteActionBar'
import { RouteContractsList } from '../../components/detail/RouteContractsList'
import { AddContractToRouteModal } from '../../components/detail/AddContractToRouteModal'
import { RouteSettingsModal } from '../../components/RouteSettingsModal'

/** Même composition que Desktop (pas de grille 2 colonnes : une liste de contrats n'a pas de partenaire naturel de 2e colonne) — seul le padding `p-4` diffère. */
export function MobileRouteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: route, isLoading } = useRoute(id)
  const {
    data: routeContracts,
    isLoading: contractsLoading,
    isError: contractsError,
  } = useRouteContracts(id)
  const deleteRoute = useDeleteRoute()

  const [addOpen, setAddOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (isLoading || !route || !id) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  const currentRoute = route

  function handleDelete() {
    if (
      !window.confirm(`Supprimer la route « ${currentRoute.nom} » ? Ses contrats redeviendront non assignés.`)
    )
      return
    deleteRoute.mutate(currentRoute.id, { onSuccess: () => navigate('/routes') })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <RouteDetailHeader route={route} />
      <RouteActionBar
        onAddContract={() => setAddOpen(true)}
        onDeleteRoute={handleDelete}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <RouteContractsList
        routeId={id}
        routeContracts={routeContracts}
        isLoading={contractsLoading}
        isError={contractsError}
      />

      <AddContractToRouteModal open={addOpen} onClose={() => setAddOpen(false)} routeId={id} />
      <RouteSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} route={route} />
    </div>
  )
}
