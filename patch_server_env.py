import re

with open("server.ts", "r") as f:
    content = f.read()

content = content.replace(
    'const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co";',
    'const supabaseUrl = process.env.VITE_SUPABASE_URL || "";'
)

content = content.replace(
    'const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF";',
    'const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";'
)

with open("server.ts", "w") as f:
    f.write(content)
