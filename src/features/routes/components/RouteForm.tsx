import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { MapPin, Truck, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { routeSchema } from '../schemas/route.schema'
import type { RouteFormValues } from '../schemas/route.schema'
import { ROUTE_COLOR_PRESETS } from '../types/route.types'
import type { Route } from '../types/route.types'
import { RouteColorPicker } from './RouteColorPicker'

type RouteFormProps = {
  route?: Route
  isSubmitting: boolean
  onSubmit: (values: RouteFormValues) => void
  onCancel: () => void
}

export function RouteForm({ route, isSubmitting, onSubmit, onCancel }: RouteFormProps) {
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    mode: 'onTouched',
    defaultValues: {
      nom: route?.nom ?? '',
      couleur: route?.couleur ?? ROUTE_COLOR_PRESETS[0],
      operatorId: route?.operatorId ?? '',
      equipmentId: route?.equipmentId ?? '',
    },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Nom" icon={MapPin} error={errors.nom?.message} {...register('nom')} />

      <Controller
        control={control}
        name="couleur"
        render={({ field }) => (
          <RouteColorPicker value={field.value} onChange={field.onChange} error={errors.couleur?.message} />
        )}
      />

      <Select
        label="Opérateur assigné"
        icon={User}
        error={errors.operatorId?.message}
        {...register('operatorId')}
      >
        <option value="">Sélectionner...</option>
        {employees?.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.prenom} {employee.nom}
          </option>
        ))}
      </Select>

      <Select
        label="Équipement assigné"
        icon={Truck}
        error={errors.equipmentId?.message}
        {...register('equipmentId')}
      >
        <option value="">Sélectionner...</option>
        {equipments?.map((equipment) => (
          <option key={equipment.id} value={equipment.id}>
            {equipment.nom}
          </option>
        ))}
      </Select>

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
