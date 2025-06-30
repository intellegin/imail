import { createClient } from '@supabase/supabase-js';

import { Database } from '../types/user';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const options = {
  db: {
    schema: 'public' as const,
  },
};

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  options
);
