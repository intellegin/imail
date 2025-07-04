/**
 * CURSOR GENERATED FILE
 * RBAC Usage Examples for iMail Platform
 *
 * This file demonstrates how to use the new role-based access control
 * system with Admin, Coach, and Student roles.
 */

import { Router } from 'express';

import { RBACService } from '../api/auth/services/rbacService';
import {
  requirePermission,
  requireRole,
  attachUserPermissions,
} from '../middleware/rbac';
import { ROLES, PERMISSIONS } from '../types/rbac';

const router: Router = Router();

// Apply authentication and attach permissions to all routes
router.use(attachUserPermissions);

// ====================================================================
// 📚 COURSE MANAGEMENT ROUTES
// ====================================================================

// Anyone can view courses, but coaches can create/edit
router.get('/courses', requirePermission('courses', 'read'), (req, res) =>
  res.json({ message: 'Course list' })
);

// Only coaches and admins can create courses
router.post('/courses', requirePermission('courses', 'write'), (req, res) =>
  res.json({ message: 'Course created' })
);

// Only admins can delete courses
router.delete(
  '/courses/:id',
  requirePermission('courses', 'delete'),
  (req, res) => res.json({ message: 'Course deleted' })
);

// ====================================================================
// 👥 STUDENT MANAGEMENT ROUTES (Coach-specific features)
// ====================================================================

// Coaches can view all students, students can only view themselves
router.get('/students', requireRole(ROLES.COACH, ROLES.ADMIN), (req, res) =>
  res.json({ message: 'Student list' })
);

// Coaches can assign students to courses
router.post(
  '/students/:id/assign-course',
  requirePermission('students', 'assign'),
  (req, res) => res.json({ message: 'Student assigned to course' })
);

// ====================================================================
// 📊 ANALYTICS & REPORTS
// ====================================================================

// Coaches and admins can view analytics
router.get('/analytics', requirePermission('analytics', 'read'), (req, res) =>
  res.json({ message: 'Analytics data' })
);

// Students can only view their own reports
router.get(
  '/reports/my-progress',
  requirePermission('reports', 'read'),
  (req, res) => res.json({ message: 'Student progress report' })
);

// Coaches can generate reports for their students
router.post(
  '/reports/generate',
  requirePermission('reports', 'write'),
  (req, res) => res.json({ message: 'Report generated' })
);

// ====================================================================
// ⚙️ ADMIN-ONLY SYSTEM MANAGEMENT
// ====================================================================

// Only admins can manage user roles
router.post(
  '/admin/users/:id/assign-role',
  requireRole(ROLES.ADMIN),
  (req, res) => res.json({ message: 'Role assigned' })
);

// Only admins can view all system permissions
router.get('/admin/permissions', requireRole(ROLES.ADMIN), (req, res) =>
  res.json({ message: 'System permissions' })
);

// ====================================================================
// 🔍 PROGRAMMATIC PERMISSION CHECKS
// ====================================================================

// Example middleware that checks permissions programmatically
const checkCustomPermission = async (req: any, res: any, next: any) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Example: Students can only access their own data
  if (req.params.studentId && user.sub !== req.params.studentId) {
    const canAccessOtherStudents = await RBACService.hasPermission(
      user.sub,
      PERMISSIONS.STUDENTS_READ
    );

    if (!canAccessOtherStudents.allowed) {
      return res.status(403).json({
        error: 'Cannot access other student data',
        reason: canAccessOtherStudents.reason,
      });
    }
  }

  next();
};

// Usage example
router.get('/students/:studentId/progress', checkCustomPermission, (req, res) =>
  res.json({ message: 'Student progress data' })
);

// ====================================================================
// 🎯 ROLE ASSIGNMENT HELPERS
// ====================================================================

/**
 * Helper function to assign default role to new users
 */
export const assignDefaultRole = async (
  userId: string,
  userType: 'student' | 'coach'
) => {
  const roleName = userType === 'coach' ? ROLES.COACH : ROLES.STUDENT;

  const success = await RBACService.assignRole(userId, roleName);

  if (!success) {
    throw new Error(`Failed to assign ${roleName} role to user ${userId}`);
  }

  return { success: true, role: roleName };
};

/**
 * Helper function to check if user can manage another user
 */
export const canManageUser = async (
  managerId: string,
  targetUserId: string
) => {
  const manager = await RBACService.getUserWithPermissions(managerId);

  if (!manager) {
    return { allowed: false, reason: 'Manager not found' };
  }

  // Admins can manage anyone
  if (manager.roles.some((role: { name: string; }) => role.name === ROLES.ADMIN)) {
    return { allowed: true };
  }

  // Coaches can manage students
  if (manager.roles.some((role: { name: string; }) => role.name === ROLES.COACH)) {
    const target = await RBACService.getUserWithPermissions(targetUserId);

    if (target?.roles.some((role: { name: string; }) => role.name === ROLES.STUDENT)) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: 'Insufficient permissions to manage this user',
  };
};

export default router;
