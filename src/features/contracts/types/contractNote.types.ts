export type ContractNoteAuthorRef = {
  id: string
  nom: string | null
}

export type ContractNoteRow = {
  id: string
  contract_id: string
  message: string
  created_at: string
  created_by: string | null
  author: ContractNoteAuthorRef | null
}

export type ContractNote = {
  id: string
  contractId: string
  message: string
  createdAt: string
  author: ContractNoteAuthorRef | null
}
