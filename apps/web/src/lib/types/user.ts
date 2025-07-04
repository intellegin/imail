import { User } from '@imail/shared/types'

export type {
  User,
  AuthUser,
  CreateUserRequest,
  UpdateUserRequest,
} from '@imail/shared'

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  username: string
  password: string
  role: string
}

export interface Role {
  id: string
  name: string
  description?: string
  is_system_role: boolean
  created_at: Date
  updated_at: Date
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description?: string
  created_at: Date
}

export interface UserProfile {
  id: string
  email: string
  given_name?: string
  family_name?: string
  auth0_id: string
  full_name?: string
  picture_url?: string
  email_verified?: boolean
  roles: Role[]
  permissions: Permission[]
}

export interface UserProfileResponse {
  success: boolean
  data: UserProfile
}

export const ROLES = {
  ADMIN: 'Admin',
  COACH: 'Coach',
  STUDENT: 'Student',
} as const

export type RoleName = (typeof ROLES)[keyof typeof ROLES]
