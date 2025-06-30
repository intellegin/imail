// API Module - Main export file

// Export types
export type { User, UsersResponse, CreateUserData } from '../types/user'

// Export API functions
export { usersApi } from './users'

// Export client utilities (if needed elsewhere)
export { apiRequest, API_BASE_URL } from './client'

// Legacy export for backward compatibility
// import { apiRequest } from './client'
import { usersApi } from './users'

export const api = usersApi
