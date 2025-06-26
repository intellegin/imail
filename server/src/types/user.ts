/**
 * User entity interface
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  updated_at: Date;
  created_at: Date;
}

/**
 * Data required to create a new user
 */
export interface CreateUserData {
  email: string;
  username?: string;
  name?: string;
}
