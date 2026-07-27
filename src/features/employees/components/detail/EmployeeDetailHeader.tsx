import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmployeeStatusBadge } from '../EmployeeStatusBadge'
import type { Employee } from '../../types/employee.types'

type EmployeeDetailHeaderProps = {
  employee: Employee
  onEdit: () => void
  onDelete: () => void
}

/** Pas de menu "…" statut ici : `actif` est un simple booléen édité via le formulaire (`EmployeeForm`), aucun sélecteur multi-valeurs n'existait avant ce restyle. */
export function EmployeeDetailHeader({ employee, onEdit, onDelete }: EmployeeDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{employee.poste ?? 'Employé'}</p>
        <h1 className="text-section font-semibold text-reca-black">
          {employee.prenom} {employee.nom}
        </h1>
        <div className="mt-2">
          <EmployeeStatusBadge actif={employee.actif} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onDelete}
          className="sm:w-auto border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Supprimer
        </Button>
      </div>
    </div>
  )
}
