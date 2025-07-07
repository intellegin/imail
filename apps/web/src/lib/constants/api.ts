export const API_ENDPOINTS = {
  AUTH: {
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout',
    LOGIN: '/login',
    PROFILE: '/auth/profile',
    ME: '/auth/me',
    ROLES: '/auth/roles',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    CREATE: '/users',
    LIST: (limit = 30, skip = 0) => `/users?limit=${limit}&skip=${skip}`,
  },
} as const

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const

export const API_CONFIG = {
  DEFAULT_LIMIT: 30,
  DEFAULT_SKIP: 0,
  CONTENT_TYPE: 'application/json',
} as const
