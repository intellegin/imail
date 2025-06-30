export const API_ENDPOINTS = {
  AUTH: {
    VERIFY: '/api/auth/verify',
    LOGOUT: '/api/auth/logout',
    LOGIN: '/login',
    PROFILE: '/api/auth/profile',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    CREATE: '/users/add',
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
