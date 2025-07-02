export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  created_at: Date;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: Date;
  expires_at?: Date;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: Date;
}

export interface UserWithRoles {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  roles: Role[];
  permissions: Permission[];
}

export interface PermissionCheck {
  resource: string;
  action: string;
}

export type PermissionResult = {
  allowed: boolean;
  reason?: string;
};

export const ROLES = {
  ADMIN: 'Admin',
  COACH: 'Coach',
  STUDENT: 'Student',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // User management
  USERS_READ: { resource: 'users', action: 'read' },
  USERS_WRITE: { resource: 'users', action: 'write' },
  USERS_DELETE: { resource: 'users', action: 'delete' },

  // Profile management
  PROFILE_READ: { resource: 'profile', action: 'read' },
  PROFILE_WRITE: { resource: 'profile', action: 'write' },

  // Course management
  COURSES_READ: { resource: 'courses', action: 'read' },
  COURSES_WRITE: { resource: 'courses', action: 'write' },
  COURSES_DELETE: { resource: 'courses', action: 'delete' },

  // Content management
  CONTENT_READ: { resource: 'content', action: 'read' },
  CONTENT_WRITE: { resource: 'content', action: 'write' },

  // Student management
  STUDENTS_READ: { resource: 'students', action: 'read' },
  STUDENTS_WRITE: { resource: 'students', action: 'write' },
  STUDENTS_ASSIGN: { resource: 'students', action: 'assign' },

  // Analytics and reporting
  ANALYTICS_READ: { resource: 'analytics', action: 'read' },
  REPORTS_READ: { resource: 'reports', action: 'read' },
  REPORTS_WRITE: { resource: 'reports', action: 'write' },
} as const;
