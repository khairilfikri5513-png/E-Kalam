lines = []
with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "match(/\\.(mp4|webm|ogg|mov)$/i)" in line:
        skip = True
        new_lines.append(line.replace("(previewUrl || currentAvatarUrl!).match(/\\.(mp4|webm|ogg|mov)$/i) || (selectedFile && selectedFile.type.startsWith('video/')) ? (", "<video src={previewUrl || currentAvatarUrl!} controls playsInline preload=\"metadata\" className=\"max-w-full max-h-full object-contain drop-shadow-md rounded-lg\">Browser anda tidak menyokong tag video.</video>"))
        continue
    if skip:
        if "alt=\"Preview\"" in line:
            pass
        if "/>" in line:
            pass
        if ") : (" in line:
            skip = False
        continue
    new_lines.append(line)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.writelines(new_lines)
