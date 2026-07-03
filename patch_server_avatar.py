import re

with open("server.ts", "r") as f:
    content = f.read()

pattern = re.compile(
    r'if \(key === "muallim_khairil_avatar" \|\| key === "muallimah_ummi_avatar"\) \{\n\s*const filename = key === "muallim_khairil_avatar" \? "muallim-khairil-avatar\.png" : "muallimah-ummi-avatar\.png";\n\s*if \(storageAvatars\.find\(\(f: any\) => f\.name === filename\)\) \{\n\s*result\[key\] = `\$\{supabaseUrl\}/storage/v1/object/public/e-kalam-assets/avatars/\$\{filename\}\?t=\$\{Date\.now\(\)\}`;\n\s*\} else \{\n\s*result\[key\] = defaults\[key\] \|\| "";\n\s*\}\n\s*\}'
)

replacement = """if (key === "muallim_khairil_avatar" || key === "muallimah_ummi_avatar") {
            const baseName = key === "muallim_khairil_avatar" ? "muallim-khairil-avatar" : "muallimah-ummi-avatar";
            const matches = storageAvatars.filter((f: any) => f.name.startsWith(baseName));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/avatars/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = defaults[key] || "";
            }
          }"""

content = pattern.sub(replacement, content)

with open("server.ts", "w") as f:
    f.write(content)
