import { RequestHandler } from 'express';

import { RBACService } from '../api/auth/services/rbacService';
import { PermissionCheck } from '../types/rbac';

/**
 * Middleware to check if user has required permission
 */
export const requirePermission = (
  resource: string,
  action: string
): RequestHandler => {
  return async (req, res, next) => {
    const user = req.user as any;

    if (!user || !user.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const check: PermissionCheck = { resource, action };
      const result = await RBACService.hasPermissionByAuth0Id(user.sub, check);

      if (!result.allowed) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: `${resource}:${action}`,
          reason: result.reason,
        });
      }

      next();
    } catch (error) {
      console.error('RBAC permission check failed:', error);
      return res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

/**
 * Middleware to check if user has any of the required roles
 */
export const requireRole = (...roleNames: string[]): RequestHandler => {
  return async (req, res, next) => {
    const user = req.user as any;

    if (!user || !user.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const userWithRoles = await RBACService.getUserWithPermissionsByAuth0Id(
        user.sub
      );

      if (!userWithRoles) {
        return res.status(403).json({ error: 'User not found' });
      }

      const hasRequiredRole = userWithRoles.roles.some((role: { name: string; }) =>
        roleNames.includes(role.name)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({
          error: 'Insufficient role permissions',
          required: roleNames,
          current: userWithRoles.roles.map((r: { name: any; }) => r.name),
        });
      }

      next();
    } catch (error) {
      console.error('RBAC role check failed:', error);
      return res.status(500).json({ error: 'Role check failed' });
    }
  };
};

/**
 * Middleware to attach user permissions to request object
 */
export const attachUserPermissions: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (user && user.sub) {
    try {
      const userWithRoles = await RBACService.getUserWithPermissionsByAuth0Id(
        user.sub
      );
      req.userPermissions = userWithRoles || undefined;
    } catch (error) {
      console.error('Failed to attach user permissions:', error);
    }
  }

  next();
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      userPermissions?: import('../types/rbac').UserWithRoles;
    }
  }
}
