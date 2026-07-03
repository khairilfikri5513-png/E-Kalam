import re

with open("server.ts", "r") as f:
    content = f.read()

pattern = re.compile(
    r'const result: Record<string, string> = \{\};\n\s*const defaults: Record<string, string> = \{\n\s*muallim_khairil_avatar: "/assets/muallim_khairil.png",\n\s*muallimah_ummi_avatar: "/assets/muallimah_ummi.png",\n\s*\};\n\s*keys\.forEach\(\(key\) => \{\n\s*const dbFound = dbAssets\.find\(\(a\) => a\.asset_key === key\);\n\s*if \(dbFound && dbFound\.public_url\) \{\n\s*result\[key\] = dbFound\.public_url;\n\s*\} else if \(defaults\[key\]\) \{\n\s*result\[key\] = defaults\[key\];\n\s*\} else \{\n\s*result\[key\] = "";\n\s*\}\n\s*\}\);',
    re.DOTALL
)

replacement = """
      let storageAvatars: any[] = [];
      let storageAudios: any[] = [];
      try {
        const { data: avData } = await supabase.storage.from("e-kalam-assets").list("avatars");
        if (avData) storageAvatars = avData;
        const { data: auData } = await supabase.storage.from("e-kalam-assets").list("audios");
        if (auData) storageAudios = auData;
      } catch (e) { }

      const result: Record<string, string> = {};
      const defaults: Record<string, string> = {
        muallim_khairil_avatar: "/assets/muallim_khairil.png",
        muallimah_ummi_avatar: "/assets/muallimah_ummi.png",
      };

      for (const key of keys) {
        const dbFound = dbAssets.find((a) => a.asset_key === key);
        if (dbFound && dbFound.public_url) {
          result[key] = dbFound.public_url;
        } else {
          if (key === "muallim_khairil_avatar" || key === "muallimah_ummi_avatar") {
            const filename = key === "muallim_khairil_avatar" ? "muallim-khairil-avatar.png" : "muallimah-ummi-avatar.png";
            if (storageAvatars.find((f: any) => f.name === filename)) {
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/avatars/${filename}?t=${Date.now()}`;
            } else {
              result[key] = defaults[key] || "";
            }
          } else if (key.startsWith("audio_activity_")) {
            const matches = storageAudios.filter((f: any) => f.name.startsWith(`${key}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/audios/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else {
            result[key] = defaults[key] || "";
          }
        }
      }
"""

content = pattern.sub(replacement, content)

with open("server.ts", "w") as f:
    f.write(content)

