import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as contractWizardSettingsService from '../services/contractWizardSettings.service'
import type { ContractWizardDefaults } from '../types/contractWizardDefaults.types'
import { contractKeys } from './contractKeys'

export function useUpdateContractWizardDefaults() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ContractWizardDefaults) =>
      contractWizardSettingsService.updateContractWizardDefaults(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.wizardDefaults() })
      toast.success('Paramètres par défaut du Wizard mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour les paramètres par défaut.'),
  })
}
