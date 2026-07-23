import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useRoutes } from '../../hooks/useRoutes'
import { useAssignContractToRoute } from '../../hooks/useAssignContractToRoute'

const NUMBERED_THRESHOLD = 5

type QuickAssignControlProps = {
  contractId: string
}

/**
 * ≤5 routes : boutons numérotés (1 clic = assignation immédiate). >5 routes : `<Select>`.
 * Objectif du brief : assigner un contrat en moins de 3 secondes.
 */
export function QuickAssignControl({ contractId }: QuickAssignControlProps) {
  const [open, setOpen] = useState(false)
  const { data: routes } = useRoutes()
  const assignContract = useAssignContractToRoute()

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Assigner
      </Button>
    )
  }

  if (!routes || routes.length === 0) {
    return <span className="text-label text-reca-gray-medium">Aucune route existante.</span>
  }

  if (routes.length <= NUMBERED_THRESHOLD) {
    return (
      <div className="flex items-center gap-2">
        {routes.map((route, index) => (
          <button
            key={route.id}
            type="button"
            title={route.nom}
            disabled={assignContract.isPending}
            onClick={() => assignContract.mutate({ contractId, routeId: route.id })}
            className="flex size-9 items-center justify-center rounded-full text-body font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: route.couleur }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    )
  }

  return (
    <Select
      label="Sélectionner une route"
      icon={ListFilter}
      disabled={assignContract.isPending}
      defaultValue=""
      onChange={(event) => {
        const routeId = event.target.value
        if (routeId) assignContract.mutate({ contractId, routeId })
      }}
    >
      <option value="" disabled>
        Sélectionner une route
      </option>
      {routes.map((route) => (
        <option key={route.id} value={route.id}>
          {route.nom}
        </option>
      ))}
    </Select>
  )
}
