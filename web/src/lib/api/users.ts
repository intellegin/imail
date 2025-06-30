import type { User, UsersResponse, CreateUserData } from '../types/user'
import { API_ENDPOINTS, HTTP_METHODS } from '../constants/api'

import { apiRequest } from './client'

export const usersApi = {
  getUsers: (limit = 30, skip = 0, accessToken?: string) =>
    apiRequest<UsersResponse>(
      API_ENDPOINTS.USERS.LIST(limit, skip),
      {},
      accessToken
    ),

  getUser: (id: number) => apiRequest<User>(API_ENDPOINTS.USERS.BY_ID(id)),

  createUser: (userData: CreateUserData) =>
    apiRequest<User>(API_ENDPOINTS.USERS.CREATE, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(userData),
    }),

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
