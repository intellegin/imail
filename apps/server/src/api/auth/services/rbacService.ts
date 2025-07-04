import { queryAsSystem } from '@imail/shared';

import {
  Permission,
  PermissionCheck,
  PermissionResult,
  Role,
  UserWithRoles,
} from '../../../types/rbac';

export class RBACService {
  /**
   * Get user with their roles and permissions
   */
  static async getUserWithPermissions(
    userId: string
  ): Promise<UserWithRoles | null> {
    const query = `
      SELECT 
        u.id, u.email, u.given_name, u.family_name,
        r.id as role_id, r.name as role_name, r.description as role_description, r.is_system_role,
        p.id as permission_id, p.name as permission_name, p.resource, p.action, p.description as permission_description
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1
    `;

    const result = await queryAsSystem(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const roles: Role[] = [];
    const permissions: Permission[] = [];
    const roleIds = new Set<string>();
    const permissionIds = new Set<string>();

    result.rows.forEach((row: any) => {
      // Collect unique roles
      if (row.role_id && !roleIds.has(row.role_id)) {
        roleIds.add(row.role_id);
        roles.push({
          id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          is_system_role: row.is_system_role,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Collect unique permissions
      if (row.permission_id && !permissionIds.has(row.permission_id)) {
        permissionIds.add(row.permission_id);
        permissions.push({
          id: row.permission_id,
          name: row.permission_name,
          resource: row.resource,
          action: row.action,
          description: row.permission_description,
          created_at: new Date(),
        });
      }
    });

    return {
      id: user.id,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      roles,
      permissions,
    };
  }

  /**
   * Check if user has specific permission by internal user ID
   */
  static async hasPermission(
    userId: string,
    check: PermissionCheck
  ): Promise<PermissionResult> {
    const user = await this.getUserWithPermissions(userId);

    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    // Check if user has the specific permission
    const hasPermission = user.permissions.some(
      (p: Permission) =>
        p.resource === check.resource && p.action === check.action
    );

    if (hasPermission) {
      return { allowed: true };
    }

    // Check for wildcard permissions (admin might have resource:* or *:*)
    const hasWildcardResource = user.permissions.some(
      (p: Permission) => p.resource === '*' && p.action === check.action
    );

    const hasWildcardAction = user.permissions.some(
      (p: Permission) => p.resource === check.resource && p.action === '*'
    );

    const hasFullWildcard = user.permissions.some(
      (p: Permission) => p.resource === '*' && p.action === '*'
    );

    if (hasWildcardResource || hasWildcardAction || hasFullWildcard) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Missing permission: ${check.resource}:${check.action}`,
    };
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: string,
    roleName: string,
    assignedBy?: string
  ): Promise<boolean> {
    const query = `
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      SELECT $1, r.id, $3
      FROM roles r
      WHERE r.name = $2
      ON CONFLICT (user_id, role_id) DO NOTHING
    `;

    const result = await queryAsSystem(query, [userId, roleName, assignedBy]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Remove role from user
   */
  static async removeRole(userId: string, roleName: string): Promise<boolean> {
    const query = `
      DELETE FROM user_roles 
      WHERE user_id = $1 
      AND role_id = (SELECT id FROM roles WHERE name = $2)
    `;

    const result = await queryAsSystem(query, [userId, roleName]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Get all available roles
   */
  static async getAllRoles(): Promise<Role[]> {
    const query = 'SELECT * FROM roles ORDER BY name';
    const result = await queryAsSystem(query);
    return result.rows;
  }

  /**
   * Get all available permissions
   */
  static async getAllPermissions(): Promise<Permission[]> {
    const query = 'SELECT * FROM permissions ORDER BY resource, action';
    const result = await queryAsSystem(query);
    return result.rows;
  }

  // ===== Auth0 ID Methods =====

  /**
   * Get user with their roles and permissions by Auth0 ID
   */
  static async getUserWithPermissionsByAuth0Id(
    auth0Id: string
  ): Promise<UserWithRoles | null> {
    const query = `
      SELECT 
        u.id, u.email, u.given_name, u.family_name,
        r.id as role_id, r.name as role_name, r.description as role_description, r.is_system_role,
        p.id as permission_id, p.name as permission_name, p.resource, p.action, p.description as permission_description
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.auth0_id = $1
    `;

    const result = await queryAsSystem(query, [auth0Id]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const roles: Role[] = [];
    const permissions: Permission[] = [];
    const roleIds = new Set<string>();
    const permissionIds = new Set<string>();

    result.rows.forEach((row: any) => {
      // Collect unique roles
      if (row.role_id && !roleIds.has(row.role_id)) {
        roleIds.add(row.role_id);
        roles.push({
          id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          is_system_role: row.is_system_role,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Collect unique permissions
      if (row.permission_id && !permissionIds.has(row.permission_id)) {
        permissionIds.add(row.permission_id);
        permissions.push({
          id: row.permission_id,
          name: row.permission_name,
          resource: row.resource,
          action: row.action,
          description: row.permission_description,
          created_at: new Date(),
        });
      }
    });

    return {
      id: user.id,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      roles,
      permissions,
    };
  }

  /**
   * Check if user has specific permission by Auth0 ID
   */
  static async hasPermissionByAuth0Id(
    auth0Id: string,
    check: PermissionCheck
  ): Promise<PermissionResult> {
    const user = await this.getUserWithPermissionsByAuth0Id(auth0Id);

    if (!user) {
      return { allowed: false, reason: 'User not found' };
    }

    // Check if user has the specific permission
    const hasPermission = user.permissions.some(
      (p: Permission) =>
        p.resource === check.resource && p.action === check.action
    );

    if (hasPermission) {
      return { allowed: true };
    }

    // Check for wildcard permissions (admin might have resource:* or *:*)
    const hasWildcardResource = user.permissions.some(
      (p: Permission) => p.resource === '*' && p.action === check.action
    );

    const hasWildcardAction = user.permissions.some(
      (p: Permission) => p.resource === check.resource && p.action === '*'
    );

    const hasFullWildcard = user.permissions.some(
      (p: Permission) => p.resource === '*' && p.action === '*'
    );

    if (hasWildcardResource || hasWildcardAction || hasFullWildcard) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Missing permission: ${check.resource}:${check.action}`,
    };
  }
}
