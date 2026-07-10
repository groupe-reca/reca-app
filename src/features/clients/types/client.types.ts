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
  createdAt: string
}
