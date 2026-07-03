import re

with open("server.ts", "r") as f:
    content = f.read()

# Add storageUnitVideos to the top block
content = content.replace(
    'let storageAudios: any[] = [];',
    'let storageAudios: any[] = [];\n      let storageUnitVideos: any[] = [];'
)

content = content.replace(
    '        if (auData) storageAudios = auData;',
    '        if (auData) storageAudios = auData;\n        const { data: vidData } = await supabase.storage.from("e-kalam-assets").list("unit_videos");\n        if (vidData) storageUnitVideos = vidData;'
)

# Add fallback for unit_video_
old_fallback = """          } else if (key.startsWith("audio_activity_")) {
            const matches = storageAudios.filter((f: any) => f.name.startsWith(`${key}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/audios/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else {"""

new_fallback = """          } else if (key.startsWith("audio_activity_")) {
            const matches = storageAudios.filter((f: any) => f.name.startsWith(`${key}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/audios/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else if (key.startsWith("unit_")) {
            const baseName = key.replace(/_/g, '-');
            const matches = storageUnitVideos.filter((f: any) => f.name.startsWith(`${baseName}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/unit_videos/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else {"""

content = content.replace(old_fallback, new_fallback)

with open("server.ts", "w") as f:
    f.write(content)
