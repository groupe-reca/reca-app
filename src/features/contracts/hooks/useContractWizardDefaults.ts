import { useQuery } from '@tanstack/react-query'
import * as contractWizardSettingsService from '../services/contractWizardSettings.service'
import { contractKeys } from './contractKeys'

export function useContractWizardDefaults() {
  return useQuery({
    queryKey: contractKeys.wizardDefaults(),
    queryFn: contractWizardSettingsService.getContractWizardDefaults,
  })
}
