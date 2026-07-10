import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Briefcase, Calendar, Image, Mail, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { employeeSchema } from '../schemas/employee.schema'
import type { EmployeeFormValues } from '../schemas/employee.schema'
import { EMPLOYEE_ROLES } from '../types/employee.types'
import type { Employee } from '../types/employee.types'

type EmployeeFormProps = {
  employee?: Employee
  isSubmitting: boolean
  onSubmit: (values: EmployeeFormValues) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, isSubmitting, onSubmit, onCancel }: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    mode: 'onTouched',
    defaultValues: employee
      ? {
          prenom: employee.prenom,
          nom: employee.nom,
          telephone: employee.telephone ?? '',
          courriel: employee.courriel ?? '',
          poste: employee.poste ?? '',
          role: employee.role ?? '',
          dateEmbauche: employee.dateEmbauche ?? '',
          actif: employee.actif,
          photo: employee.photo ?? '',
          notes: employee.notes ?? '',
        }
      : { actif: true },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Prénom" icon={User} error={errors.prenom?.message} {...register('prenom')} />
        <Input label="Nom" icon={User} error={errors.nom?.message} {...register('nom')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Téléphone" icon={Phone} error={errors.telephone?.message} {...register('telephone')} />
        <Input label="Courriel" icon={Mail} error={errors.courriel?.message} {...register('courriel')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Poste" icon={Briefcase} error={errors.poste?.message} {...register('poste')} />
        <Select label="Rôle" icon={Briefcase} error={errors.role?.message} {...register('role')}>
          <option value="">Sélectionner...</option>
          {EMPLOYEE_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date d'embauche"
          type="date"
          icon={Calendar}
          error={errors.dateEmbauche?.message}
          {...register('dateEmbauche')}
        />
        <Input label="Photo (URL)" icon={Image} error={errors.photo?.message} {...register('photo')} />
      </div>

      <label className="flex items-center gap-2 text-body text-reca-black">
        <input
          type="checkbox"
          className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
          {...register('actif')}
        />
        Employé actif
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('notes')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {employee ? 'Enregistrer' : 'Créer l’employé'}
        </Button>
      </div>
    </form>
  )
}
