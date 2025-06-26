import pool from '../../../db';
import { User, CreateUserData } from '../../../types/user';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    const query = `
      SELECT id, email, username, name, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getUserById(id: string): Promise<User | null> {
    const query = `
      SELECT id, email, username, name, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, username, name, created_at, updated_at 
      FROM users 
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    const { email, username, name } = userData;
    const query = `
      INSERT INTO users (email, username, name) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, username, name, created_at, updated_at
    `;
    const result = await pool.query(query, [email, username, name]);
    return result.rows[0];
  }

  static async updateUser(
    id: string,
    updateData: Partial<CreateUserData>
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING id, email, username, name, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
}
