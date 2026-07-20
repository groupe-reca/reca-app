import { supabase } from '@/lib/supabaseClient'
import { DEFAULT_CONTRACT_WIZARD_DEFAULTS } from '../types/contractWizardDefaults.types'
import type { ContractWizardDefaults } from '../types/contractWizardDefaults.types'

type SettingsWizardDefaultsRow = {
  contract_wizard_defaults: Partial<ContractWizardDefaults> | null
}

export async function getContractWizardDefaults(): Promise<ContractWizardDefaults> {
  const { data, error } = await supabase
    .from('settings')
    .select('contract_wizard_defaults')
    .eq('id', true)
    .single()
  if (error) throw error
  const row = data as SettingsWizardDefaultsRow
  return { ...DEFAULT_CONTRACT_WIZARD_DEFAULTS, ...row.contract_wizard_defaults }
}

export async function updateContractWizardDefaults(
  values: ContractWizardDefaults,
): Promise<ContractWizardDefaults> {
  const { data, error } = await supabase
    .from('settings')
    .update({ contract_wizard_defaults: values } as never)
    .eq('id', true)
    .select('contract_wizard_defaults')
    .single()
  if (error) throw error
  const row = data as SettingsWizardDefaultsRow
  return { ...DEFAULT_CONTRACT_WIZARD_DEFAULTS, ...row.contract_wizard_defaults }
}
