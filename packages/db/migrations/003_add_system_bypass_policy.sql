-- Create a function to check if we're in system/auth context
CREATE OR REPLACE FUNCTION public.is_system_context()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('app.system_context', true)::BOOLEAN;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add system bypass policy for authentication operations
CREATE POLICY "System can manage users during auth" ON public.users
  FOR ALL
  USING (public.is_system_context() = true);

-- Grant execute permission on the new function
GRANT EXECUTE ON FUNCTION public.is_system_context() TO postgres;