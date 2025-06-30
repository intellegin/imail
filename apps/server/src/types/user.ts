/**
 * User entity interface matching Supabase users table schema
 */
export interface User {
  id: number;
  created_at: string;
  auth0_id: string;
  email: string;
  full_name: string | null;
  picture_url: string | null;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  user_metadata: Record<string, any> | null;
  app_metadata: Record<string, any> | null;
  updated_at: string;
}

/**
 * Data required to create/upsert a new user from Auth0
 */
export interface UpsertUserData {
  auth0_id: string;
  email: string;
  full_name?: string | null;
  picture_url?: string | null;
  email_verified?: boolean;
  user_metadata?: Record<string, any> | null;
  app_metadata?: Record<string, any> | null;
}

/**
 * Data for updating user status
 */
export interface UpdateUserStatusData {
  is_active: boolean;
}

/**
 * Database schema type for Supabase integration
 * This follows the pattern of Supabase's generated types
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, 'id' | 'created_at'>> & {
          updated_at?: string;
        };
      };
    };
  };
}

/**
 * Auth0 user data interface for type safety
 */
export interface Auth0User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}
