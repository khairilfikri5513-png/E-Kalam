import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

async function check() {
  const { data, error } = await supabase.rpc("verify_admin_token", { p_token: "admin_token_khairil1014" });
  console.log("RPC Data:", data);
  console.log("RPC Error:", error);
}

check();
