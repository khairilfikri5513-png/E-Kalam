import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const keys = ['muallim_khairil_avatar', 'muallimah_ummi_avatar'];
  const dbAssets = []; // ignoring dbAssets
  
  let storageAvatars: any[] = [];
  try {
    const { data: avData } = await supabase.storage.from("e-kalam-assets").list("avatars");
    if (avData) storageAvatars = avData;
  } catch (e) { }

  console.log("storageAvatars:", storageAvatars.map(f => f.name));

  const result: Record<string, string> = {};
  const defaults: Record<string, string> = {
    muallim_khairil_avatar: "/assets/muallim_khairil.png",
    muallimah_ummi_avatar: "/assets/muallimah_ummi.png",
  };

  for (const key of keys) {
    if (key === "muallim_khairil_avatar" || key === "muallimah_ummi_avatar") {
      const baseName = key === "muallim_khairil_avatar" ? "muallim-khairil-avatar" : "muallimah-ummi-avatar";
      const matches = storageAvatars.filter((f: any) => f.name.startsWith(baseName));
      console.log(`Matches for ${baseName}:`, matches.map(m => m.name));
      if (matches.length > 0) {
        matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/avatars/${matches[0].name}?t=${Date.now()}`;
      } else {
        result[key] = defaults[key] || "";
      }
    }
  }
  
  console.log("Result:", result);
}
run();
