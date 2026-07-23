import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarDays, Clock, Route as RouteIcon, Truck, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useRoutes } from '@/features/routes/hooks/useRoutes'
import { interventionSchema } from '../schemas/intervention.schema'
import type { InterventionFormValues } from '../schemas/intervention.schema'
import type { Intervention } from '../types/intervention.types'

type InterventionFormProps = {
  intervention?: Intervention
  isSubmitting: boolean
  onSubmit: (values: InterventionFormValues) => void
  onCancel: () => void
}

export function InterventionForm({ intervention, isSubmitting, onSubmit, onCancel }: InterventionFormProps) {
  const { data: routes } = useRoutes()
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionSchema),
    mode: 'onTouched',
    defaultValues: intervention
      ? {
          date: intervention.date,
          heurePrevue: intervention.heurePrevue ?? '',
          routeId: intervention.routeId,
          employeeId: intervention.employeeId ?? '',
          equipmentId: intervention.equipmentId ?? '',
          commentaires: intervention.commentaires ?? '',
        }
      : { date: new Date().toISOString().slice(0, 10) },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Date" type="date" icon={CalendarDays} error={errors.date?.message} {...register('date')} />
        <Input
          label="Heure prévue"
          type="time"
          icon={Clock}
          error={errors.heurePrevue?.message}
          {...register('heurePrevue')}
        />
      </div>

      <Select label="Route" icon={RouteIcon} error={errors.routeId?.message} {...register('routeId')}>
        <option value="">Sélectionner une route</option>
        {routes?.map((route) => (
          <option key={route.id} value={route.id}>
            {route.numero} — {route.nom}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Employé" icon={User} error={errors.employeeId?.message} {...register('employeeId')}>
          <option value="">Sélectionner un employé</option>
          {employees
            ?.filter((employee) => employee.actif)
            .map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.prenom} {employee.nom}
              </option>
            ))}
        </Select>
        <Select label="Équipement" icon={Truck} error={errors.equipmentId?.message} {...register('equipmentId')}>
          <option value="">Aucun</option>
          {equipments?.map((equipment) => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.numero} — {equipment.nom}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="commentaires" className="text-label font-medium text-reca-gray-medium">
          Commentaires
        </label>
        <textarea
          id="commentaires"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('commentaires')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {intervention ? 'Enregistrer' : "Créer l'intervention"}
        </Button>
      </div>
    </form>
  )
}
