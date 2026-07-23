import { useQuery } from '@tanstack/react-query'
import { useContractWizardDefaults } from '@/features/contracts/hooks/useContractWizardDefaults'
import * as unassignedContractsService from '../services/unassignedContracts.service'
import { routeKeys } from './routeKeys'

/**
 * "Saison courante" = settings.contract_wizard_defaults.saison (seule source de vérité pour
 * ce concept dans le repo, déjà utilisée comme valeur par défaut à la création d'un contrat).
 */
export function useUnassignedContracts() {
  const wizardDefaults = useContractWizardDefaults()
  const season = wizardDefaults.data?.saison ?? null

  return useQuery({
    queryKey: routeKeys.unassignedContracts(season),
    queryFn: () => unassignedContractsService.listUnassignedContracts(season),
    enabled: wizardDefaults.isSuccess,
  })
}
