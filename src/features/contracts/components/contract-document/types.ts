import type { Client } from '@/features/clients/types/client.types'
import type { Settings } from '@/features/settings/types/settings.types'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { Contract } from '../../types/contract.types'

/**
 * Forme de données commune à tous les sous-composants de la prévisualisation de
 * contrat — chacun n'en reçoit qu'une tranche. Volontairement un simple objet de
 * props (aucun hook/route à l'intérieur des composants qui la consomment) pour
 * qu'un futur moteur PDF puisse réutiliser ces mêmes composants tels quels.
 */
export type ContractDocumentData = {
  contract: Contract
  client: Client
  zones: ContractZoneFormValues[]
  settings: Settings
}
