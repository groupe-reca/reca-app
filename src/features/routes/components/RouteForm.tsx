import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Clock, MapPin, Palette, Route as RouteIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import { routeSchema } from '../schemas/route.schema'
import type { RouteFormValues } from '../schemas/route.schema'
import type { Route } from '../types/route.types'

type RouteFormProps = {
  route?: Route
  isSubmitting: boolean
  onSubmit: (values: RouteFormValues) => void
  onCancel: () => void
}

export function RouteForm({ route, isSubmitting, onSubmit, onCancel }: RouteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    mode: 'onTouched',
    defaultValues: route
      ? {
          nom: route.nom,
          secteur: route.secteur ?? '',
          description: route.description ?? '',
          dureeEstimee: route.dureeEstimee ?? '',
          distance: route.distance?.toString() ?? '',
          couleur: route.couleur ?? '#DA291C',
        }
      : { couleur: '#DA291C' },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Nom" icon={RouteIcon} error={errors.nom?.message} {...register('nom')} />
        <Input label="Secteur" icon={MapPin} error={errors.secteur?.message} {...register('secteur')} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {isMapboxConfigured ? (
          <div className="col-span-2 flex flex-col gap-1.5">
            <p className="text-label font-medium text-reca-gray-medium">Distance et durée estimée</p>
            <p className="text-body text-reca-black">
              {route?.distance != null ? `${route.distance} km` : '—'} · {route?.dureeEstimee ?? '—'}
            </p>
            <p className="text-label text-reca-gray-medium">
              Distance et durée sont calculées automatiquement à partir de l'ordre des clients.
            </p>
          </div>
        ) : (
          <>
            <Input
              label="Durée estimée"
              icon={Clock}
              placeholder="3 hours 30 minutes"
              error={errors.dureeEstimee?.message}
              {...register('dureeEstimee')}
            />
            <Input
              label="Distance (km)"
              type="number"
              step="0.1"
              icon={MapPin}
              error={errors.distance?.message}
              {...register('distance')}
            />
          </>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="couleur" className="text-label font-medium text-reca-gray-medium">
            Couleur
          </label>
          <div className="relative">
            <Palette
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
              aria-hidden="true"
            />
            <input
              id="couleur"
              type="color"
              className="h-11 w-full rounded-control border border-reca-gray-light bg-reca-white pl-9 pr-3"
              {...register('couleur')}
            />
          </div>
        </div>
      </div>
      {!isMapboxConfigured && (
        <p className="text-label text-reca-gray-medium">
          Calcul automatique indisponible (token Mapbox non configuré) — saisie manuelle.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-label font-medium text-reca-gray-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('description')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {route ? 'Enregistrer' : 'Créer la route'}
        </Button>
      </div>
    </form>
  )
}
