import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

pattern = re.compile(
    r'\{previewUrl \|\| currentAvatarUrl \? \(\n\s*\(\(previewUrl.*?\)\n\s*\) : \(\n\s*<div className="text-slate-400 flex flex-col items-center">',
    re.DOTALL
)

replacement = """{previewUrl || currentAvatarUrl ? (
                  (previewUrl || currentAvatarUrl!)?.match(/\\.(mp4|webm|ogg|mov)$/i) || (selectedFile && selectedFile.type.startsWith('video/')) ? (
                    <video
                      src={previewUrl || currentAvatarUrl!}
                      controls
                      autoPlay
                      muted
                      loop
                      className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                    >
                      Browser anda tidak menyokong tag video.
                    </video>
                  ) : (
                    <img
                      src={previewUrl || currentAvatarUrl!}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain drop-shadow-md"
                    />
                  )
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">"""

content = pattern.sub(replacement, content)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)

