import { API_ENDPOINTS, HTTP_METHODS, API_CONFIG } from '../constants/api'
import type {
  User,
  UsersResponse,
  CreateUserData,
  UserProfileResponse,
} from '../types/user'

import { apiRequest } from './client'

export const usersApi = {
  getUsers: (
    limit = API_CONFIG.DEFAULT_LIMIT,
    skip = API_CONFIG.DEFAULT_SKIP,
    accessToken?: string
  ) =>
    apiRequest<UsersResponse>(
      API_ENDPOINTS.USERS.LIST(limit, skip),
      {},
      accessToken
    ),

  getUser: (id: number) => apiRequest<User>(API_ENDPOINTS.USERS.BY_ID(id)),

  getUserProfile: (accessToken?: string) =>
    apiRequest<UserProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE,
      {},
      accessToken
    ),

  getRoles: (accessToken?: string) =>
    apiRequest<{ id: string; name: string }[]>(
      API_ENDPOINTS.AUTH.ROLES,
      {},
      accessToken
    ),

  createUser: (userData: CreateUserData, accessToken?: string) =>
    apiRequest<User>(
      API_ENDPOINTS.USERS.CREATE,
      {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(userData),
      },
      accessToken
    ),

  updateUser: (id: number, userData: Partial<User>) =>
    apiRequest<User>(API_ENDPOINTS.USERS.BY_ID(id), {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(userData),
    }),

  deleteUser: (id: number) =>
    apiRequest<{ id: number; deleted: boolean }>(
      API_ENDPOINTS.USERS.BY_ID(id),
      {
        method: HTTP_METHODS.DELETE,
      }
    ),
}
