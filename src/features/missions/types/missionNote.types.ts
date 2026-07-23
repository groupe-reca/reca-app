export type MissionNoteAuthorRef = {
  id: string
  nom: string | null
}

export type MissionNoteRow = {
  id: string
  mission_id: string
  message: string
  created_at: string
  created_by: string | null
  author: MissionNoteAuthorRef | null
}

export type MissionNote = {
  id: string
  missionId: string
  message: string
  createdAt: string
  author: MissionNoteAuthorRef | null
}
