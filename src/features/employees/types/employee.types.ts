export const EMPLOYEE_ROLES = ['Administrateur', 'Employé'] as const

export type EmployeeRow = {
  id: string
  user_id: string | null
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  poste: string | null
  role: string | null
  date_embauche: string | null
  actif: boolean
  photo: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Employee = {
  id: string
  userId: string | null
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  poste: string | null
  role: string | null
  dateEmbauche: string | null
  actif: boolean
  photo: string | null
  notes: string | null
  createdAt: string
}
