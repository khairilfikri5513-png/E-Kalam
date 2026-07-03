import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.storage.from('e-kalam-assets').list('avatars');
  console.log("Data:", data);
}
run();
