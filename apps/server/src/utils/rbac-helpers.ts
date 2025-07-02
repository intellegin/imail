import { RBACService } from '../api/auth/services/rbacService';
import { ROLES, RoleName, Role } from '../types/rbac';

export const assignDefaultStudentRole = async (
  userId: string,
  userEmail: string
): Promise<boolean> => {
  try {
    const success = await RBACService.assignRole(userId, ROLES.STUDENT);

    if (success) {
      console.log(`✅ Successfully assigned Student role to: ${userEmail}`);
      return true;
    } else {
      console.warn(
        `⚠️ Failed to assign Student role to: ${userEmail} (role may already exist)`
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ Error assigning Student role to ${userEmail}:`, error);
    return false;
  }
};

export const getUserRoleType = async (
  userId: string
): Promise<RoleName | null> => {
  try {
    const user = await RBACService.getUserWithPermissions(userId);

    if (!user || user.roles.length === 0) {
      return null;
    }

    if (user.roles.some((role: Role) => role.name === ROLES.ADMIN)) {
      return ROLES.ADMIN;
    }

    if (user.roles.some((role: Role) => role.name === ROLES.COACH)) {
      return ROLES.COACH;
    }

    if (user.roles.some((role: Role) => role.name === ROLES.STUDENT)) {
      return ROLES.STUDENT;
    }

    return null;
  } catch (error) {
    console.error('Error getting user role type:', error);
    return null;
  }
};

export const canAccessStudentFeatures = async (
  userId: string
): Promise<boolean> => {
  try {
    const roleType = await getUserRoleType(userId);
    return roleType !== null;
  } catch (error) {
    console.error('Error checking student feature access:', error);
    return false;
  }
};

export const canAccessCoachFeatures = async (
  userId: string
): Promise<boolean> => {
  try {
    const roleType = await getUserRoleType(userId);
    return roleType === ROLES.COACH || roleType === ROLES.ADMIN;
  } catch (error) {
    console.error('Error checking coach feature access:', error);
    return false;
  }
};

export const canAccessAdminFeatures = async (
  userId: string
): Promise<boolean> => {
  try {
    const roleType = await getUserRoleType(userId);
    return roleType === ROLES.ADMIN;
  } catch (error) {
    console.error('Error checking admin feature access:', error);
    return false;
  }
};
