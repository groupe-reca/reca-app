import { useMemo } from 'react'
import { CheckCircle2, ShieldCheck, Users, XCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import type { Employee } from '../types/employee.types'

type EmployeesStatsRowProps = {
  employees: Employee[]
}

export function EmployeesStatsRow({ employees }: EmployeesStatsRowProps) {
  const counts = useMemo(
    () => ({
      total: employees.length,
      actifs: employees.filter((employee) => employee.actif).length,
      inactifs: employees.filter((employee) => !employee.actif).length,
      administrateurs: employees.filter((employee) => employee.role === 'Administrateur').length,
    }),
    [employees],
  )

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={Users} iconColor="blue" value={counts.total} label="Total" />
      <StatCard icon={CheckCircle2} iconColor="green" value={counts.actifs} label="Actifs" />
      <StatCard icon={XCircle} iconColor="gray" value={counts.inactifs} label="Inactifs" />
      <StatCard icon={ShieldCheck} iconColor="red" value={counts.administrateurs} label="Administrateurs" />
    </div>
  )
}
