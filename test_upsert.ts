import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

async function check() {
  const { data, error } = await supabase.from("app_assets").upsert({
    asset_key: "test",
    title: "test",
    file_path: "test",
    public_url: "test",
    asset_type: "test",
    updated_at: new Date().toISOString()
  });
  console.log("Upsert Error:", error);
}

check();
