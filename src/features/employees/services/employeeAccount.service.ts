import { supabase } from '@/lib/supabaseClient'
import type { Role } from '@/features/auth/types/auth.types'

export type EmployeeAccount = {
  id: string
  email: string
  role: Role
  actif: boolean
}

export async function getEmployeeAccount(userId: string): Promise<EmployeeAccount> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, actif')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as EmployeeAccount
}

export async function updateAccountRole(userId: string, role: Role): Promise<EmployeeAccount> {
  const { data, error } = await supabase
    .from('users')
    .update({ role } as never)
    .eq('id', userId)
    .select('id, email, role, actif')
    .single()

  if (error) throw error
  return data as EmployeeAccount
}
