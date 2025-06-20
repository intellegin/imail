import type { User, UsersResponse, CreateUserData } from '../types/user'

import { apiRequest } from './client'

export const usersApi = {
  getUsers: (limit = 30, skip = 0) =>
    apiRequest<UsersResponse>(`/users?limit=${limit}&skip=${skip}`),

  getUser: (id: number) => apiRequest<User>(`/users/${id}`),

  createUser: (userData: CreateUserData) =>
    apiRequest<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUser: (id: number, userData: Partial<User>) =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  deleteUser: (id: number) =>
    apiRequest<{ id: number; deleted: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    }),
}
