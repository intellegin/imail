import { query, queryWithUser, queryAsSystem } from '@imail/shared';
import { RBACService } from '../../auth/services/rbacService';
import { ROLES } from '../../../types/rbac';
import { User, UpsertUserData } from '../../../types/user';

export class UserService {
  static async getAllUsers(limit = 30, skip = 0): Promise<User[]> {
    try {
      // Get users with their roles from the RBAC system
      const result = await query(
        `SELECT 
          u.id, u.created_at, u.auth0_id, u.email, u.full_name, 
          u.given_name, u.family_name, u.picture_url, u.email_verified, 
          u.is_active, u.user_metadata, u.app_metadata, u.updated_at,
          COALESCE(
            STRING_AGG(r.name, ', ' ORDER BY r.name), 
            'No Role'
          ) as role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        LEFT JOIN roles r ON ur.role_id = r.id
        GROUP BY u.id, u.created_at, u.auth0_id, u.email, u.full_name, 
                 u.given_name, u.family_name, u.picture_url, u.email_verified, 
                 u.is_active, u.user_metadata, u.app_metadata, u.updated_at
        ORDER BY u.created_at DESC 
        LIMIT $1 OFFSET $2`,
        [limit, skip]
      );
      return result.rows;
    } catch (err) {
      console.error('getAllUsers error:', err);
      return [];
    }
  }

  static async getUserById(
    id: number,
    requestingUserAuth0Id: string
  ): Promise<User | null> {
    try {
      const result = await queryWithUser(
        requestingUserAuth0Id,
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }

  static async getUserByAuth0Id(auth0_id: string): Promise<User | null> {
    try {
      const result = await queryWithUser(
        auth0_id,
        'SELECT * FROM users WHERE auth0_id = $1',
        [auth0_id]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }

  static async getUserByAuth0IdAsSystem(
    auth0_id: string
  ): Promise<User | null> {
    try {
      const result = await queryAsSystem(
        'SELECT * FROM users WHERE auth0_id = $1',
        [auth0_id]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }

  static async getUserByEmail(
    email: string,
    requestingUserAuth0Id: string
  ): Promise<User | null> {
    try {
      const result = await queryWithUser(
        requestingUserAuth0Id,
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error}`);
    }
  }

  static async upsertUserOnLogin(userData: UpsertUserData): Promise<User> {
    try {
      const existingUser = await queryAsSystem(
        'SELECT id FROM users WHERE auth0_id = $1',
        [userData.auth0_id]
      );

      const isNewUser = existingUser.rows.length === 0;

      const result = await queryAsSystem(
        `INSERT INTO users (auth0_id, email, full_name, given_name, family_name, picture_url, email_verified, is_active, role, user_metadata, app_metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'user', $8, $9)
         ON CONFLICT (auth0_id) DO UPDATE SET
           email = EXCLUDED.email,
           full_name = EXCLUDED.full_name,
           given_name = EXCLUDED.given_name,
           family_name = EXCLUDED.family_name,
           picture_url = EXCLUDED.picture_url,
           email_verified = EXCLUDED.email_verified,
           is_active = true,
           user_metadata = EXCLUDED.user_metadata,
           app_metadata = EXCLUDED.app_metadata,
           updated_at = NOW()
         RETURNING *`,
        [
          userData.auth0_id,
          userData.email,
          userData.full_name,
          userData.given_name,
          userData.family_name,
          userData.picture_url,
          userData.email_verified ?? false,
          userData.user_metadata ?? {},
          userData.app_metadata ?? {},
        ]
      );

      const user = result.rows[0];

      try {
        const userRoles = await queryAsSystem(
          'SELECT COUNT(*) as role_count FROM user_roles WHERE user_id = $1',
          [user.id]
        );

        const hasRoles = userRoles.rows[0]?.role_count > 0;

        console.log(
          `🔍 User ${user.email} (ID: ${user.id}) role check: ${hasRoles ? 'has roles' : 'no roles'}`
        );

        if (!hasRoles) {
          console.log(
            `🎯 Attempting to assign Student role to user ${user.email} (ID: ${user.id})`
          );

          const roleAssigned = await RBACService.assignRole(
            user.id.toString(),
            ROLES.STUDENT
          );

          if (roleAssigned) {
            console.log(
              `✅ Successfully assigned Student role to user: ${user.email} (${isNewUser ? 'new user' : 'existing user without roles'})`
            );

            // Verify the assignment worked
            const verifyRoles = await queryAsSystem(
              'SELECT COUNT(*) as role_count FROM user_roles WHERE user_id = $1',
              [user.id]
            );
            console.log(
              `✔️ Verification: User ${user.email} now has ${verifyRoles.rows[0]?.role_count} role(s)`
            );
          } else {
            console.error(
              `❌ Failed to assign Student role to user ${user.email} (ID: ${user.id}): Role assignment returned false. Check if Student role exists in roles table.`
            );
          }
        } else if (isNewUser) {
          console.log(
            `ℹ️ New user ${user.email} already has ${userRoles.rows[0]?.role_count} role(s) assigned`
          );
        } else {
          console.log(
            `ℹ️ Existing user ${user.email} has ${userRoles.rows[0]?.role_count} role(s), no action needed`
          );
        }
      } catch (roleError) {
        console.error(
          `❌ Error checking/assigning Student role to user ${user.email}:`,
          roleError
        );
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to upsert user: ${error}`);
    }
  }

  static async updateUser(
    id: number,
    updateData: Partial<UpsertUserData>,
    requestingUserAuth0Id: string
  ): Promise<User | null> {
    try {
      const fields = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      const values = Object.values(updateData);

      const result = await queryWithUser(
        requestingUserAuth0Id,
        `UPDATE users SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  static async updateUserStatusOnLogout(
    auth0_id: string
  ): Promise<User | null> {
    try {
      const result = await queryWithUser(
        auth0_id,
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE auth0_id = $1 RETURNING *',
        [auth0_id]
      );
      return result.rows[0] ?? null;
    } catch (error) {
      throw new Error(`Failed to update user status: ${error}`);
    }
  }

  static async deleteUser(
    id: number,
    requestingUserAuth0Id: string
  ): Promise<boolean> {
    try {
      await queryWithUser(
        requestingUserAuth0Id,
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }
}
