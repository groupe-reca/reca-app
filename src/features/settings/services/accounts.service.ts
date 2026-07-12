import { supabase } from '@/lib/supabaseClient'
import type { Role } from '@/features/auth/types/auth.types'

export type Account = {
  id: string
  email: string
  role: Role
  actif: boolean
  derniereConnexion: string | null
}

type AccountRow = {
  id: string
  email: string
  role: Role
  actif: boolean
  derniere_connexion: string | null
}

const SELECT_FIELDS = 'id, email, role, actif, derniere_connexion'

function mapAccount(row: AccountRow): Account {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    actif: row.actif,
    derniereConnexion: row.derniere_connexion,
  }
}

export async function listAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('users').select(SELECT_FIELDS).order('email', { ascending: true })
  if (error) throw error
  return ((data ?? []) as AccountRow[]).map(mapAccount)
}

export async function updateAccountRole(id: string, role: Role): Promise<Account> {
  const { data, error } = await supabase
    .from('users')
    .update({ role } as never)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return mapAccount(data as AccountRow)
}

export async function updateAccountActive(id: string, actif: boolean): Promise<Account> {
  const { data, error } = await supabase
    .from('users')
    .update({ actif } as never)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return mapAccount(data as AccountRow)
}
