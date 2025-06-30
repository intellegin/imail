export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface User {
    id: number;
    created_at: string;
    auth0_id: string;
    email: string;
    full_name: string | null;
    given_name: string | null;
    family_name: string | null;
    picture_url: string | null;
    role: string;
    email_verified: boolean;
    is_active: boolean;
    user_metadata: Record<string, any> | null;
    app_metadata: Record<string, any> | null;
    updated_at: string;
}
export interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: User['role'];
}
export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    role?: User['role'];
}
export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: User['role'];
}
export interface UpsertUserData {
    auth0_id: string;
    email: string;
    full_name?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    picture_url?: string | null;
    email_verified?: boolean;
    user_metadata?: Record<string, any> | null;
    app_metadata?: Record<string, any> | null;
}
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
