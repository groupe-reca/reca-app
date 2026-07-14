import { useDeviceTier } from '@/hooks/useDeviceTier'
import { ContractWizard } from '../components/wizard/ContractWizard'
import { MobileContractWizard } from '../components/wizard/mobile/MobileContractWizard'

export function ContractWizardPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileContractWizard /> : <ContractWizard />
}
