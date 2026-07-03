import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

# Replace the preview conditional to always assume it's a video
pattern = re.compile(
    r'\{previewUrl \|\| currentAvatarUrl \? \(\n\s*\(previewUrl \|\| currentAvatarUrl!\)\.match\(/\\\.\(mp4\|webm\|ogg\|mov\)\\\$/i\) \|\| \(selectedFile && selectedFile\.type\.startsWith\(\'video/\'\)\) \? \(\n\s*<video\n\s*src=\{previewUrl \|\| currentAvatarUrl!\}\n\s*controls\n\s*playsInline\n\s*preload="metadata"\n\s*className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"\n\s*>\n\s*Browser anda tidak menyokong tag video\.\n\s*</video>\n\s*\) : \(\n\s*<img\n\s*src=\{previewUrl \|\| currentAvatarUrl!\}\n\s*alt="Preview"\n\s*className="max-w-full max-h-full object-contain drop-shadow-md"\n\s*/>\n\s*\)\n\s*\) : \('
)

replacement = """{previewUrl || currentAvatarUrl ? (
                  <video
                    src={previewUrl || currentAvatarUrl!}
                    controls
                    playsInline
                    preload="metadata"
                    className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                  >
                    Browser anda tidak menyokong tag video.
                  </video>
                ) : ("""

content = pattern.sub(replacement, content)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
