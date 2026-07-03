import dotenv from "dotenv";
dotenv.config();

console.log("Keys:");
console.log("VITE_SUPABASE_URL", process.env.VITE_SUPABASE_URL ? "Exists" : "No");
console.log("VITE_SUPABASE_ANON_KEY", process.env.VITE_SUPABASE_ANON_KEY ? "Exists" : "No");
console.log("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Exists" : "No");
