export type SettingsTaxes = {
  tps: number
  tvq: number
}

export type SettingsColors = {
  primaire: string
  secondaire: string
}

export type SettingsRow = {
  id: boolean
  nom: string | null
  logo: string | null
  telephone: string | null
  courriel: string | null
  taxes: Partial<SettingsTaxes> | null
  adresse: string | null
  couleurs: Partial<SettingsColors> | null
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
  updatedAt: string
}
