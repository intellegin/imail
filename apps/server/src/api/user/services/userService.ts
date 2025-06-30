import { supabase } from '../../../db/supabase';
import { User, UpsertUserData } from '../../../types/user';

export class UserService {
  static async getAllUsers(
    limit: number = 30,
    skip: number = 0
  ): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(skip, skip + limit - 1);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      return data ?? [];
    } catch (err) {
      console.error('getAllUsers error:', err);
      return [];
    }
  }

  static async getUserById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data ?? null;
  }

  static async getUserByAuth0Id(auth0_id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', auth0_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data ?? null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    return data ?? null;
  }

  static async upsertUserOnLogin(userData: UpsertUserData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        auth0_id: userData.auth0_id,
        email: userData.email,
        full_name: userData.full_name,
        picture_url: userData.picture_url,
        email_verified: userData.email_verified ?? false,
        is_active: true,
        role: 'user',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert user: ${error.message}`);
    }

    return data;
  }

  static async updateUserStatusOnLogout(
    auth0_id: string
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_active: false,
      })
      .eq('auth0_id', auth0_id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to update user status: ${error.message}`);
    }

    return data ?? null;
  }

  static async updateUser(
    id: number,
    updateData: Partial<UpsertUserData>
  ): Promise<User | null> {
    const updatePayload = {
      ...updateData,
    };

    const { data, error } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data ?? null;
  }

  static async deleteUser(id: number): Promise<boolean> {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return true;
  }
}
