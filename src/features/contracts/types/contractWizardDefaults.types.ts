import type { DepotNeige, ModeConclusion, SeuilDeclenchementCm, ServiceCode } from './contract.types'

/**
 * Paramètres du Wizard Contrats qui sont "toujours les mêmes pour tout le
 * monde" (tâche 5) — configurés une fois par un administrateur plutôt que
 * saisis à chaque contrat. Stockés dans `settings.contract_wizard_defaults`
 * (jsonb), même pattern que `settings.modules`/`settings.taxes`.
 */
export type ContractWizardDefaults = {
  saison: string
  dateDebut: string
  dateFin: string
  /** Tâche 11 : date fixe du 2e versement pour l'échéancier "Bi-paiement", plus calculée à +3 mois. */
  dateDeuxiemeVersement: string
  serviceCodes: ServiceCode[]
  seuilDeclenchementCm: SeuilDeclenchementCm
  heurePremierPassage: string
  depotNeige: DepotNeige
  modeConclusion: ModeConclusion
}

export const DEFAULT_CONTRACT_WIZARD_DEFAULTS: ContractWizardDefaults = {
  saison: '2026-2027',
  dateDebut: '2026-11-01',
  dateFin: '2027-05-01',
  dateDeuxiemeVersement: '2027-02-01',
  serviceCodes: ['deneigement'],
  seuilDeclenchementCm: 5,
  heurePremierPassage: '07:00',
  depotNeige: 'sur_terrain',
  modeConclusion: 'en_personne',
}
