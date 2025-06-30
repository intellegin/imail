-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current authenticated user's auth0_id
-- This will be set by your application when making database queries
CREATE OR REPLACE FUNCTION public.get_current_user_auth0_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_auth0_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for SELECT (Read): Users can only read their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth0_id = public.get_current_user_auth0_id());

-- Policy for INSERT (Create): Allow authenticated users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth0_id = public.get_current_user_auth0_id());

-- Policy for UPDATE: Users can only update their own data
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth0_id = public.get_current_user_auth0_id())
  WITH CHECK (auth0_id = public.get_current_user_auth0_id());

-- Policy for DELETE: Users can only delete their own data
CREATE POLICY "Users can delete own profile" ON public.users
  FOR DELETE
  USING (auth0_id = public.get_current_user_auth0_id());

-- Grant necessary permissions for the application
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.users TO postgres;
GRANT EXECUTE ON FUNCTION public.get_current_user_auth0_id() TO postgres;