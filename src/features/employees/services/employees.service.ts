import { createCrudService } from '@/lib/supabaseCrud'
import type { EmployeeFormValues } from '../schemas/employee.schema'
import type { Employee, EmployeeRow } from '../types/employee.types'

const employeesCrud = createCrudService<EmployeeRow>('employees')

function mapEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    userId: row.user_id,
    prenom: row.prenom,
    nom: row.nom,
    telephone: row.telephone,
    courriel: row.courriel,
    poste: row.poste,
    role: row.role,
    dateEmbauche: row.date_embauche,
    actif: row.actif,
    photo: row.photo,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

function toRowInput(values: EmployeeFormValues): Partial<EmployeeRow> {
  return {
    prenom: values.prenom,
    nom: values.nom,
    telephone: values.telephone || null,
    courriel: values.courriel || null,
    poste: values.poste || null,
    role: values.role || null,
    date_embauche: values.dateEmbauche || null,
    actif: values.actif ?? true,
    photo: values.photo || null,
    notes: values.notes || null,
  }
}

export async function listEmployees(): Promise<Employee[]> {
  const rows = await employeesCrud.list()
  return rows.map(mapEmployee)
}

export async function getEmployee(id: string): Promise<Employee> {
  const row = await employeesCrud.getById(id)
  return mapEmployee(row)
}

export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  const row = await employeesCrud.create(toRowInput(values))
  return mapEmployee(row)
}

export async function updateEmployee(id: string, values: EmployeeFormValues): Promise<Employee> {
  const row = await employeesCrud.update(id, toRowInput(values))
  return mapEmployee(row)
}

export async function softDeleteEmployee(id: string): Promise<void> {
  await employeesCrud.softDelete(id)
}
