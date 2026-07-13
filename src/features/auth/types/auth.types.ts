export type Role = 'administrateur' | 'employe'

export type User = {
  id: string
  email: string
  nom: string | null
  role: Role
  actif: boolean
  derniereConnexion: string | null
}

export type Session = {
  user: User
  accessToken: string
  expiresAt: number
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthError = {
  code: 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED'
  message: string
}
