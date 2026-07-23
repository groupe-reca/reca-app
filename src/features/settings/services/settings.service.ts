import { supabase } from '@/lib/supabaseClient'
import type { SettingsFormValues } from '../schemas/settings.schema'
import type { Settings, SettingsModules, SettingsRow } from '../types/settings.types'

const DEFAULT_TAXES = { tps: 5, tvq: 9.975 }
const DEFAULT_COLORS = { primaire: '#DA291C', secondaire: '#0F172A' }
const DEFAULT_MODULES: SettingsModules = {
  leads: true,
  quotes: true,
  clients: true,
  contracts: true,
  invoices: true,
  payments: true,
  routes: true,
  equipment: true,
  employees: true,
}

function mapSettings(row: SettingsRow): Settings {
  return {
    nom: row.nom,
    logo: row.logo,
    telephone: row.telephone,
    courriel: row.courriel,
    taxes: { ...DEFAULT_TAXES, ...row.taxes },
    adresse: row.adresse,
    couleurs: { ...DEFAULT_COLORS, ...row.couleurs },
    modules: { ...DEFAULT_MODULES, ...row.modules },
    assurancePoliceNo: row.assurance_police_no,
    updatedAt: row.updated_at,
  }
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('settings').select('*').eq('id', true).single()
  if (error) throw error
  return mapSettings(data as SettingsRow)
}

export async function updateSettings(values: SettingsFormValues): Promise<Settings> {
  const input = {
    nom: values.nom || null,
    adresse: values.adresse || null,
    telephone: values.telephone || null,
    courriel: values.courriel || null,
    logo: values.logo || null,
    taxes: { tps: Number(values.tps), tvq: Number(values.tvq) },
    couleurs: {
      primaire: values.couleurPrimaire || DEFAULT_COLORS.primaire,
      secondaire: values.couleurSecondaire || DEFAULT_COLORS.secondaire,
    },
    assurance_police_no: values.assurancePoliceNo || null,
  }

  const { data, error } = await supabase
    .from('settings')
    .update(input as never)
    .eq('id', true)
    .select('*')
    .single()

  if (error) throw error
  return mapSettings(data as SettingsRow)
}

export async function updateModules(modules: SettingsModules): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .update({ modules } as never)
    .eq('id', true)
    .select('*')
    .single()

  if (error) throw error
  return mapSettings(data as SettingsRow)
}
