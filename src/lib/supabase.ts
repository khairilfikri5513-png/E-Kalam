import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcsyiabtsxpsccsvhsrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
