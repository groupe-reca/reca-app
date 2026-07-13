export type SettingsTaxes = {
  tps: number
  tvq: number
}

export type SettingsColors = {
  primaire: string
  secondaire: string
}

export type ModuleKey =
  | 'leads'
  | 'quotes'
  | 'clients'
  | 'contracts'
  | 'invoices'
  | 'payments'
  | 'routes'
  | 'equipment'
  | 'employees'

export type SettingsModules = Record<ModuleKey, boolean>

export type SettingsRow = {
  id: boolean
  nom: string | null
  logo: string | null
  telephone: string | null
  courriel: string | null
  taxes: Partial<SettingsTaxes> | null
  adresse: string | null
  couleurs: Partial<SettingsColors> | null
  modules: Partial<SettingsModules> | null
  created_at: string
  updated_at: string
}

export type Settings = {
  nom: string | null
  logo: string | null
  telephone: string | null
  courriel: string | null
  taxes: SettingsTaxes
  adresse: string | null
  couleurs: SettingsColors
  modules: SettingsModules
  updatedAt: string
}
