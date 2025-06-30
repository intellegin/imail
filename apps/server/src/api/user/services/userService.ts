import { query, queryWithUser, queryAsSystem } from '../../../db/postgres';
import { User, UpsertUserData } from '../../../types/user';

export class UserService {
  // GET methods
  static async getAllUsers(limit = 30, skip = 0): Promise<User[]> {
    try {
      const result = await query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
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

  // POST methods
  static async upsertUserOnLogin(userData: UpsertUserData): Promise<User> {
    try {
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
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upsert user: ${error}`);
    }
  }

  // PUT methods
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

  // DELETE methods
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
