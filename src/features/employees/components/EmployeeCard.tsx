import { User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatPhone } from '@/lib/format'
import { EmployeeStatusBadge } from './EmployeeStatusBadge'
import type { Employee } from '../types/employee.types'

type EmployeeCardProps = {
  employee: Employee
  onClick: () => void
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <User className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">
              {employee.prenom} {employee.nom}
            </span>
            <EmployeeStatusBadge actif={employee.actif} />
          </div>
          <p className="truncate text-label text-reca-gray-medium">{employee.poste ?? '—'}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>{formatPhone(employee.telephone) || '—'}</span>
            <span>{employee.role ?? '—'}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
