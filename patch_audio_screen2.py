import re

with open("src/pages/admin/AudioUploadScreen.tsx", "r") as f:
    content = f.read()

pattern = re.compile(
    r'const \{ data, error \} = await supabase\n\s*\.from\("app_assets"\)\n\s*\.select\("asset_key, public_url"\)\n\s*\.in\("asset_key", keys\);\n\n\s*if \(!error && data\) \{\n\s*const audioMap: Record<string, string> = \{\};\n\s*data\.forEach\(item => \{\n\s*if \(item\.public_url\) \{\n\s*audioMap\[item\.asset_key\] = item\.public_url;\n\s*\}\n\s*\}\);\n\s*setUploadedAudios\(audioMap\);\n\s*\} else \{\n\s*// Fallback check local /api/assets if supabase tables empty or offline\n\s*const keysParam = keys\.join\(","\);\n\s*const localRes = await fetch\(`/api/assets\?keys=\$\{encodeURIComponent\(keysParam\)\}`\);\n\s*if \(localRes\.ok\) \{\n\s*const data = await localRes\.json\(\);\n\s*setUploadedAudios\(data\);\n\s*\}\n\s*\}'
)

replacement = """
        const keysParam = keys.join(",");
        const response = await fetch(`/api/assets?keys=${encodeURIComponent(keysParam)}`);
        if (response.ok) {
          const data = await response.json();
          setUploadedAudios(data);
        }
"""

content = pattern.sub(replacement, content)

with open("src/pages/admin/AudioUploadScreen.tsx", "w") as f:
    f.write(content)

