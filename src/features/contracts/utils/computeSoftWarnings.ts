import type { ModeConclusion } from '../types/contract.types'

type SoftWarningInput = {
  modeConclusion: ModeConclusion
  modePaiement: string
  dateSignature: string
  dateDebut: string
  modalitesPaiement: { dateEcheance: string }[]
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Avertissements non bloquants (jamais une erreur Zod, jamais de blocage de
 * soumission) — recommandations OPC sur les modalités de paiement selon le mode
 * de conclusion. Fonction pure, réutilisable par l'étape "Modalités & Obligations"
 * et par l'étape "Révision".
 */
export function computeSoftWarnings(values: SoftWarningInput): string[] {
  const warnings: string[] = []
  const signature = values.dateSignature ? new Date(values.dateSignature) : null
  const debut = values.dateDebut ? new Date(values.dateDebut) : null
  const echeances = values.modalitesPaiement
    .filter((entry) => entry.dateEcheance)
    .map((entry) => new Date(entry.dateEcheance))

  if (values.modeConclusion === 'itinerant' && signature) {
    const minDate = addDays(signature, 10)
    if (echeances.some((date) => date < minDate)) {
      warnings.push(
        "Contrat itinérant : aucun acompte ne peut être demandé ou accepté dans les 10 jours suivant la signature — au moins une échéance tombe avant ce délai.",
      )
    }
  }

  if (values.modeConclusion === 'a_distance' && values.modePaiement !== 'carte' && debut) {
    if (echeances.some((date) => date < debut)) {
      warnings.push(
        "Contrat à distance : le paiement anticipé n'est permis que par carte de crédit — au moins une échéance précède le début du service avec un autre mode de paiement.",
      )
    }
  }

  if (debut) {
    const twoMonthsBefore = addMonths(debut, -2)
    if (echeances.some((date) => date < twoMonthsBefore)) {
      warnings.push(
        "Au moins une échéance précède le début du service de plus de 2 mois — rappel : les sommes perçues avant le début du service doivent être déposées en fidéicommis (OPC).",
      )
    }
  }

  return warnings
}
