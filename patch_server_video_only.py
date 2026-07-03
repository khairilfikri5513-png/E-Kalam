import re

with open("server.ts", "r") as f:
    content = f.read()

pattern = re.compile(
    r'const allowedMimeTypes = \["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/webm", "video/ogg", "video/quicktime"\];\n\s*const resolvedMime = mimeType \|\| "image/png";\n\s*if \(!allowedMimeTypes\.includes\(resolvedMime\)\) \{\n\s*return res\.status\(400\)\.json\(\{ error: "Hanya fail format imej \(PNG, JPG\) dan video \(MP4, WEBM\) dibenarkan\." \}\);\n\s*\}'
)

replacement = """const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      const resolvedMime = mimeType || "video/mp4";
      if (!allowedMimeTypes.includes(resolvedMime)) {
        return res.status(400).json({ error: "Hanya fail format video (MP4, WEBM) dibenarkan." });
      }"""

content = pattern.sub(replacement, content)

# Remove the isVideo variable since we now assume it's always a video
pattern2 = re.compile(
    r'const isImage = mimeType && mimeType\.startsWith\(\'image/\'\);\n\s*const isVideo = mimeType && mimeType\.startsWith\(\'video/\'\);\n\n\s*if \(isImage && buffer\.length > 2 \* 1024 \* 1024\) \{\n\s*return res\.status\(400\)\.json\(\{ error: "Saiz imej tidak boleh melebihi 2MB\." \}\);\n\s*\}\n\s*if \(isVideo && buffer\.length > 50 \* 1024 \* 1024\) \{'
)

replacement2 = """if (buffer.length > 50 * 1024 * 1024) {"""

content = pattern2.sub(replacement2, content)

with open("server.ts", "w") as f:
    f.write(content)
