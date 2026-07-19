export const CLIENT_STATUSES = ['actif', 'inactif'] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]

export const CLIENT_LANGUES = ['francais', 'anglais'] as const
export type ClientLangue = (typeof CLIENT_LANGUES)[number]

export type ClientEditorRef = {
  id: string
  nom: string | null
}

export type ClientRow = {
  id: string
  numero: string
  prenom: string
  nom: string
  entreprise: string | null
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
  latitude: number | null
  longitude: number | null
  type_client: string | null
  notes: string | null
  statut: ClientStatus
  langue: ClientLangue
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Client = {
  id: string
  numero: string
  prenom: string
  nom: string
  entreprise: string | null
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  codePostal: string | null
  latitude: number | null
  longitude: number | null
  typeClient: string | null
  notes: string | null
  statut: ClientStatus
  langue: ClientLangue
  createdAt: string
  updatedAt: string
  /** Calculé (jointure `users`, pas une colonne) — dernier utilisateur ayant modifié la fiche. */
  updatedBy: ClientEditorRef | null
}
