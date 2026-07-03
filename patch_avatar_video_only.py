import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

# Update validation in handleFileChange
pattern_validation = re.compile(
    r'// Validation\n\s*const validImageTypes = \["image/jpeg", "image/png", "image/jpg"\];\n\s*const validVideoTypes = \["video/mp4", "video/webm", "video/ogg", "video/quicktime"\];\n\s*const isImage = validImageTypes\.includes\(file\.type\);\n\s*const isVideo = validVideoTypes\.includes\(file\.type\);\n\s*if \(!isImage && !isVideo\) \{\n\s*setStatus\(\{\n\s*type: "error",\n\s*message: "Sila pilih fail gambar \(PNG, JPG\) atau video \(MP4, WEBM\)\.",\n\s*\}\);\n\s*return;\n\s*\}\n\n\s*if \(isImage && file\.size > 2 \* 1024 \* 1024\) \{\n\s*setStatus\(\{\n\s*type: "error",\n\s*message: "Saiz gambar tidak boleh melebihi 2MB\.",\n\s*\}\);\n\s*return;\n\s*\}\n\n\s*if \(isVideo && file\.size > 50 \* 1024 \* 1024\) \{'
)

replacement_validation = """// Validation
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
      const isVideo = validVideoTypes.includes(file.type);
      
      if (!isVideo) {
        setStatus({
          type: "error",
          message: "Hanya fail video MP4 atau WebM dibenarkan untuk avatar.",
        });
        return;
      }

      if (isVideo && file.size > 50 * 1024 * 1024) {"""

content = pattern_validation.sub(replacement_validation, content)

# Update the HTML input and labels
content = content.replace(
    'accept="image/png, image/jpeg, image/jpg, video/mp4, video/webm, video/ogg, video/quicktime"',
    'accept="video/mp4, video/webm, video/ogg, video/quicktime"'
)
content = content.replace(
    'Gambar (PNG, JPG) max 2MB, Video (MP4, WEBM) max 50MB',
    'Video (MP4, WEBM) max 50MB'
)
content = content.replace(
    'Klik untuk tukar media',
    'Klik untuk tukar video'
)
content = content.replace(
    'Klik untuk pilih media',
    'Klik untuk pilih video'
)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
