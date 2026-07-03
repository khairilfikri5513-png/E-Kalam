import re

with open("server.ts", "r") as f:
    content = f.read()

pattern = re.compile(
    r'const isVideo = mimeType && mimeType\.startsWith\(\'video/\'\);\n\s*if \(!isVideo && buffer\.length > 5 \* 1024 \* 1024\) \{\n\s*return res\.status\(400\)\.json\(\{ error: "Saiz gambar tidak boleh melebihi 5MB\." \}\);\n\s*\}\n\s*if \(isVideo && buffer\.length > 50 \* 1024 \* 1024\) \{\n\s*return res\.status\(400\)\.json\(\{ error: "Saiz video tidak boleh melebihi 50MB\." \}\);\n\s*\}'
)

replacement = """if (buffer.length > 50 * 1024 * 1024) {
        return res.status(400).json({ error: "Saiz video tidak boleh melebihi 50MB." });
      }"""

content = pattern.sub(replacement, content)

with open("server.ts", "w") as f:
    f.write(content)
