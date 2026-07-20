import type { PaymentScheduleEntryFormValues } from '../schemas/contractCreation.schema'

export type PaymentPresetId = 'annuel' | 'deux_versements'

export const PAYMENT_PRESET_LABELS: Record<PaymentPresetId, string> = {
  annuel: 'Annuel',
  deux_versements: 'Bi-paiement',
}

/** Échéance la plus proche (date croissante) d'un échéancier — réutilisé partout où une "prochaine échéance" est affichée. */
export function getNextPaymentEntry<T extends { dateEcheance: string }>(entries: T[]): T | undefined {
  return [...entries].sort((a, b) => a.dateEcheance.localeCompare(b.dateEcheance))[0]
}

/**
 * Génère l'échéancier `modalitesPaiement` pour un preset donné. Tâche 11 : la date du 2e
 * versement (Bi-paiement) est désormais une date fixe configurée dans les paramètres du
 * Wizard (`ContractWizardDefaults.dateDeuxiemeVersement`), plus calculée à +3 mois.
 */
export function buildPaymentSchedule(
  preset: PaymentPresetId,
  dateDebut: string,
  dateDeuxiemeVersement: string,
): PaymentScheduleEntryFormValues[] {
  switch (preset) {
    case 'annuel':
      return [{ description: 'Paiement annuel', type: 'pourcentage', valeur: '100', dateEcheance: dateDebut }]
    case 'deux_versements':
      return [
        { description: 'Premier versement', type: 'pourcentage', valeur: '50', dateEcheance: dateDebut },
        { description: 'Second versement', type: 'pourcentage', valeur: '50', dateEcheance: dateDeuxiemeVersement },
      ]
    default:
      return []
  }
}

/** Détecte quel preset correspond à l'échéancier courant — sert à surligner le sélecteur actif (tâche 11). */
export function detectPreset(entries: { description: string }[]): PaymentPresetId | null {
  if (entries.length === 1 && entries[0].description === 'Paiement annuel') return 'annuel'
  if (entries.length === 2 && entries[0].description === 'Premier versement' && entries[1].description === 'Second versement') {
    return 'deux_versements'
  }
  return null
}

/** Montant réel (en $) d'une échéance — pourcentage résolu contre le prix du contrat, sinon montant fixe. Partagé par `contracts.service.ts` (génération de factures) et les prévisualisations. */
export function computeInstallmentAmount(
  entry: { type: 'pourcentage' | 'montant'; valeur: number },
  prix: number | null,
): number {
  if (entry.type === 'pourcentage') return Math.round((((prix ?? 0) * entry.valeur) / 100) * 100) / 100
  return entry.valeur
}
