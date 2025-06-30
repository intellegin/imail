-- Add given_name and family_name columns to users table
ALTER TABLE public.users 
ADD COLUMN given_name TEXT,
ADD COLUMN family_name TEXT;