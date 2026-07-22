export type InterventionNoteAuthorRef = {
  id: string
  nom: string | null
}

export type InterventionNoteRow = {
  id: string
  intervention_id: string
  message: string
  created_at: string
  created_by: string | null
  author: InterventionNoteAuthorRef | null
}

export type InterventionNote = {
  id: string
  interventionId: string
  message: string
  createdAt: string
  author: InterventionNoteAuthorRef | null
}
