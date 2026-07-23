import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarDays, Clock, MapPin, Truck, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useRoutes } from '@/features/routes/hooks/useRoutes'
import { missionSchema } from '../schemas/mission.schema'
import type { MissionFormValues } from '../schemas/mission.schema'

type MissionFormProps = {
  isSubmitting: boolean
  onSubmit: (values: MissionFormValues) => void
  onCancel: () => void
}

export function MissionForm({ isSubmitting, onSubmit, onCancel }: MissionFormProps) {
  const { data: routes } = useRoutes()
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    mode: 'onTouched',
    defaultValues: {
      routeId: '',
      date: '',
      heurePrevue: '',
      operatorId: '',
      equipmentId: '',
      notes: '',
    },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Select label="Route" icon={MapPin} error={errors.routeId?.message} {...register('routeId')}>
        <option value="">Sélectionner...</option>
        {routes?.map((route) => (
          <option key={route.id} value={route.id}>
            {route.nom}
          </option>
        ))}
      </Select>

      <Input type="date" label="Date" icon={CalendarDays} error={errors.date?.message} {...register('date')} />

      <Input
        type="time"
        label="Heure prévue"
        icon={Clock}
        error={errors.heurePrevue?.message}
        {...register('heurePrevue')}
      />

      <Select label="Opérateur" icon={User} error={errors.operatorId?.message} {...register('operatorId')}>
        <option value="">Sélectionner...</option>
        {employees?.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.prenom} {employee.nom}
          </option>
        ))}
      </Select>

      <Select label="Équipement" icon={Truck} error={errors.equipmentId?.message} {...register('equipmentId')}>
        <option value="">Sélectionner...</option>
        {equipments?.map((equipment) => (
          <option key={equipment.id} value={equipment.id}>
            {equipment.nom}
          </option>
        ))}
      </Select>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mission-notes" className="text-label font-medium text-reca-gray-medium">
          Notes
        </label>
        <textarea
          id="mission-notes"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('notes')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Créer
        </Button>
      </div>
    </form>
  )
}
