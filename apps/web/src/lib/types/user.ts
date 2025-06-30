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
  role: 'admin' | 'moderator' | 'user'
}
