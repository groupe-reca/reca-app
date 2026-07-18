import { supabase } from '@/lib/supabaseClient'
import type { Theme } from '@/features/auth/types/auth.types'

export async function updateOwnTheme(theme: Theme): Promise<void> {
  const { error } = await supabase.rpc('update_own_theme', { new_theme: theme })
  if (error) throw error
}
