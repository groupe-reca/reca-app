export type ClientNoteAuthorRef = {
  id: string
  nom: string | null
}

export type ClientNoteRow = {
  id: string
  client_id: string
  message: string
  created_at: string
  created_by: string | null
  author: ClientNoteAuthorRef | null
}

export type ClientNote = {
  id: string
  clientId: string
  message: string
  createdAt: string
  author: ClientNoteAuthorRef | null
}
