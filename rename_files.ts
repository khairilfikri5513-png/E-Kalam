import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const ts = Date.now();
  
  const { data: d1, error: e1 } = await supabase.storage.from('e-kalam-assets').move('avatars/muallim-khairil-avatar.png', `avatars/muallim-khairil-avatar_${ts}.mp4`);
  console.log(d1, e1);
  
  const { data: d2, error: e2 } = await supabase.storage.from('e-kalam-assets').move('avatars/muallimah-ummi-avatar.png', `avatars/muallimah-ummi-avatar_${ts}.mp4`);
  console.log(d2, e2);
}
run();
