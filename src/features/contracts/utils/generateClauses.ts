import type { ObligationsAnswers } from '../types/contract.types'

export type GeneratedClauses = {
  obligationsClient: string
  exclusions: string
  nettoyageFinal: string
  responsabilites: string
}

const RESPONSABILITES =
  "L'entrepreneur n'est pas responsable des dommages causés aux objets laissés dans l'entrée. L'entrepreneur décline toute responsabilité pour les chutes ou accidents (glissades) survenant dans l'entrée."

const NETTOYAGE_FINAL =
  'Un passage de finition est effectué après le passage de la déneigeuse de la ville (chasse-neige) ou à la fin complète des précipitations.'

const EXCLUSIONS_BASE =
  "Aucun déneigement des trottoirs, des escaliers, des balcons, ni du toit. Aucun épandage de sel ou d'abrasif n'est inclus, sauf mention contraire dans les services choisis."

/**
 * Assemble le texte des clauses à partir des réponses Q&R de l'étape "Obligations" —
 * l'utilisateur ne rédige plus ce texte lui-même, il répond à des questions.
 */
export function generateClauses(answers: ObligationsAnswers): GeneratedClauses {
  const sentences: string[] = []

  sentences.push(
    answers.entreeLibreObligatoire
      ? "L'entrée doit être libre de tout véhicule ou obstacle (poubelles, jouets) lors du passage de l'entrepreneur."
      : "Le client s'engage à faciliter l'accès à la zone desservie lors du passage de l'entrepreneur, dans la mesure du possible.",
  )

  if (answers.balisesRequises) {
    sentences.push("Le client accepte l'installation de balises de signalisation en bordure de son entrée pour l'hiver.")
  }

  // 0 cm n'a pas de sens pratique comme plafond (le service ne ferait jamais rien) —
  // traité comme "non renseigné" plutôt que comme une vraie valeur choisie.
  if (answers.accumulationMaximaleCm) {
    sentences.push(
      `Le service est déclenché à partir d'une accumulation de ${answers.seuilDeclenchementCm} cm, jusqu'à un maximum de ${answers.accumulationMaximaleCm} cm par intervention.`,
    )
  } else {
    sentences.push(`Le service est déclenché à partir d'une accumulation de ${answers.seuilDeclenchementCm} cm.`)
  }

  if (answers.animaux) {
    sentences.push("Le client confirme la présence d'un animal sur le terrain — l'entrepreneur en est informé pour sa sécurité et celle de l'animal.")
  }

  if (answers.portail) {
    sentences.push("Le terrain est muni d'un portail — le client doit s'assurer qu'il reste accessible ou fournir un accès à l'entrepreneur.")
  }

  const autres = answers.autresParticularites.trim()
  if (autres) sentences.push(autres)

  return {
    obligationsClient: sentences.join(' '),
    exclusions: EXCLUSIONS_BASE,
    nettoyageFinal: NETTOYAGE_FINAL,
    responsabilites: RESPONSABILITES,
  }
}
