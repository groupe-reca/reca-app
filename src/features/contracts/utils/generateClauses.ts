import type { DepotNeige, ModeConclusion, ObligationsAnswers } from '../types/contract.types'

export type GeneratedClauses = {
  obligationsClient: string
  exclusions: string
  nettoyageFinal: string
  responsabilites: string
  clauseAnnulation: string
  clausePrix: string
  clauseExecution: string
  clauseAssurance: string
}

export type ClauseContext = {
  type: string | null
  modeConclusion: ModeConclusion
  assurancePoliceNo: string | null
}

const RESPONSABILITES =
  "L'entrepreneur n'est pas responsable des dommages causés aux objets laissés dans l'entrée. L'entrepreneur décline toute responsabilité pour les chutes ou accidents (glissades) survenant dans l'entrée."

const NETTOYAGE_FINAL =
  'Un passage de finition est effectué après le passage de la déneigeuse de la ville (chasse-neige) ou à la fin complète des précipitations.'

const EXCLUSIONS_BASE =
  "Aucun déneigement des trottoirs, des escaliers, des balcons, ni du toit. Aucun épandage de sel ou d'abrasif n'est inclus, sauf mention contraire dans les services choisis."

// Tâche 5 : plus aucune question Q&R ne pilote cette clause (entrée libre/balises/
// animaux/portail/autres particularités retirés) — texte générique fixe, au même
// titre que les autres clauses de base ci-dessus.
const OBLIGATIONS_CLIENT_BASE =
  "Le client s'engage à faciliter l'accès à la zone desservie lors du passage de l'entrepreneur, dans la mesure du possible."

const DEPOT_NEIGE_LABELS: Record<DepotNeige, string> = {
  sur_terrain: 'sur le terrain du client',
  bordure_rue: 'en bordure de rue',
  transport_hors_site: 'par transport hors site',
}

function buildClauseAnnulation(type: string | null, modeConclusion: ModeConclusion): string {
  const isCommercial = type === 'Commercial'

  if (isCommercial) {
    return "Ce contrat étant conclu avec un client commercial, celui-ci peut le résilier unilatéralement en tout temps (art. 2125 C.c.Q.), sous réserve de payer les services déjà rendus et les frais raisonnablement engagés par l'entrepreneur jusqu'à la date de résiliation (art. 2129 C.c.Q.)."
  }

  if (modeConclusion === 'a_distance') {
    return "Ce contrat a été conclu à distance (téléphone ou Internet). Un exemplaire écrit du contrat sera transmis au client dans les 15 jours suivant sa conclusion. Le client dispose d'un droit de résolution sans frais tant que le service n'a pas débuté dans les 30 jours suivant la date convenue, et pendant 7 jours après réception d'un exemplaire non conforme ou incomplet. Tout remboursement dû sera versé dans les 15 jours suivant la résolution."
  }

  if (modeConclusion === 'itinerant') {
    return "Ce contrat a été conclu par sollicitation au domicile du client (commerce itinérant). Le client dispose d'un droit de résolution de 10 jours suivant la réception de l'exemplaire signé du contrat, sans frais ni justification, même si un déneigement a déjà eu lieu. Aucun acompte ne peut être perçu par l'entrepreneur pendant ce délai. Tout remboursement dû sera versé dans les 15 jours suivant la résolution. L'entrepreneur détient le permis de commerçant itinérant requis par l'Office de la protection du consommateur."
  }

  return "Ce contrat a été conclu en personne. Aucun délai légal de résolution ne s'applique (hors commerce itinérant) — se référer aux conditions de résiliation prévues au présent contrat."
}

function buildClausePrix(): string {
  return "Le prix convenu est ferme pour toute la durée du contrat — la Loi sur la protection du consommateur interdit toute hausse de prix en cours de contrat pour un consommateur."
}

function buildClauseExecution(answers: ObligationsAnswers): string {
  const depotLabel = DEPOT_NEIGE_LABELS[answers.depotNeige]
  const permisPhrase =
    answers.depotNeige !== 'sur_terrain'
      ? answers.permisMunicipalObtenu
        ? " L'entrepreneur confirme détenir le permis municipal requis pour ce mode de dépôt."
        : " Un permis municipal peut être requis pour ce mode de dépôt — sa non-obtention peut exposer à des amendes municipales, applicables même lorsque le déneigement est confié à un entrepreneur."
      : ''

  return `Le service est déclenché à partir d'un seuil de ${answers.seuilDeclenchementCm} cm d'accumulation, avec un dégagement garanti avant ${answers.heurePremierPassage}. La neige est déposée ${depotLabel}.${permisPhrase}`
}

function buildClauseAssurance(assurancePoliceNo: string | null): string {
  if (assurancePoliceNo) {
    return `L'entrepreneur déclare détenir une assurance responsabilité civile en vigueur pour toute la durée du contrat (police n° ${assurancePoliceNo}).`
  }
  return "L'entrepreneur déclare détenir une assurance responsabilité civile en vigueur pour toute la durée du contrat."
}

/**
 * Assemble le texte des clauses — l'utilisateur ne rédige jamais ce texte
 * lui-même. `answers` (seuil/heure/dépôt de neige) provient désormais des
 * paramètres par défaut du Wizard (tâche 5, `ContractWizardDefaults`), pas
 * d'une réponse par contrat ; `context` (type de client, mode de conclusion)
 * reste collecté (client) ou configuré (mode de conclusion, en paramètres).
 *
 * ATTENTION : ce gabarit reflète les recommandations publiques de l'Office de la
 * protection du consommateur (OPC) et des articles pertinents du Code civil du
 * Québec, mais devrait être relu par un juriste avant tout usage en production.
 */
export function generateClauses(answers: ObligationsAnswers, context: ClauseContext): GeneratedClauses {
  return {
    obligationsClient: OBLIGATIONS_CLIENT_BASE,
    exclusions: EXCLUSIONS_BASE,
    nettoyageFinal: NETTOYAGE_FINAL,
    responsabilites: RESPONSABILITES,
    clauseAnnulation: buildClauseAnnulation(context.type, context.modeConclusion),
    clausePrix: buildClausePrix(),
    clauseExecution: buildClauseExecution(answers),
    clauseAssurance: buildClauseAssurance(context.assurancePoliceNo),
  }
}
