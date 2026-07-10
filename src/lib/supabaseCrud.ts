import { supabase } from './supabaseClient'

type OrderBy = { column: string; ascending?: boolean }

export function createCrudService<TRow extends { id: string }>(table: string) {
  async function list(orderBy: OrderBy = { column: 'created_at', ascending: false }): Promise<TRow[]> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .is('deleted_at', null)
      .order(orderBy.column, { ascending: orderBy.ascending ?? true })

    if (error) throw error
    return (data ?? []) as TRow[]
  }

  async function getById(id: string): Promise<TRow> {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
    if (error) throw error
    return data as TRow
  }

  async function create(input: Partial<TRow>): Promise<TRow> {
    // The Supabase client has no generated Database schema, so its query
    // builder can't verify insert/update payloads against our own TRow shape.
    const { data, error } = await supabase.from(table).insert(input as never).select().single()
    if (error) throw error
    return data as TRow
  }

  async function update(id: string, input: Partial<TRow>): Promise<TRow> {
    const { data, error } = await supabase
      .from(table)
      .update(input as never)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as TRow
  }

  async function softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  return { list, getById, create, update, softDelete }
}
