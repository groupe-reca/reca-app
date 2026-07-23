import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Check, Pencil, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { routeRenameSchema } from '../../schemas/routeRename.schema'
import type { RouteRenameFormValues } from '../../schemas/routeRename.schema'
import { useRenameRoute } from '../../hooks/useRenameRoute'
import type { RouteSummary } from '../../types/route.types'

type RouteDetailHeaderProps = {
  route: RouteSummary
}

export function RouteDetailHeader({ route }: RouteDetailHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const renameRoute = useRenameRoute(route.id)
  const { register, handleSubmit, reset } = useForm<RouteRenameFormValues>({
    resolver: zodResolver(routeRenameSchema),
    defaultValues: { nom: route.nom },
  })

  function startRenaming() {
    reset({ nom: route.nom })
    setIsRenaming(true)
  }

  function onSubmit(values: RouteRenameFormValues) {
    renameRoute.mutate(values, { onSuccess: () => setIsRenaming(false) })
  }

  return (
    <div className="flex flex-col gap-3 rounded-card bg-reca-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: route.couleur }}
          aria-hidden="true"
        />
        {isRenaming ? (
          <form className="flex items-center gap-2" onSubmit={handleSubmit(onSubmit)}>
            <input
              autoFocus
              className="h-9 rounded-control border border-reca-gray-light px-2 text-subtitle font-semibold text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
              {...register('nom')}
            />
            <button type="submit" className="text-reca-red" aria-label="Confirmer le renommage">
              <Check className="size-5" />
            </button>
            <button
              type="button"
              className="text-reca-gray-medium"
              aria-label="Annuler le renommage"
              onClick={() => setIsRenaming(false)}
            >
              <X className="size-5" />
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-subtitle font-semibold text-reca-black">{route.nom}</h1>
            <button
              type="button"
              onClick={startRenaming}
              aria-label="Renommer la route"
              className="text-reca-gray-medium hover:text-reca-black"
            >
              <Pencil className="size-4" />
            </button>
          </>
        )}
        <Badge color="green">Active</Badge>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-body text-reca-black">
        <span>Opérateur : {route.operatorName ?? '—'}</span>
        <span>Équipement : {route.equipmentName ?? '—'}</span>
        <span>
          {route.contractCount} contrat{route.contractCount > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
