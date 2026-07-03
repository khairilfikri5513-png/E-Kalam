import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

# Replace storagePath usage during upload
pattern_upload = re.compile(
    r'const url = await uploadAvatarToSupabase\(\{\n\s*file: selectedFile,\n\s*assetKey: selectedConfig\.assetKey,\n\s*storagePath: selectedConfig\.storagePath,\n\s*title: selectedConfig\.title,\n\s*\}\);'
)

replacement_upload = """
      const ext = selectedFile.name.split('.').pop() || 'png';
      const baseName = selectedConfig.assetKey === 'muallim_khairil_avatar' ? 'muallim-khairil-avatar' : 'muallimah-ummi-avatar';
      const dynamicStoragePath = `avatars/${baseName}_${Date.now()}.${ext}`;

      const url = await uploadAvatarToSupabase({
        file: selectedFile,
        assetKey: selectedConfig.assetKey,
        storagePath: dynamicStoragePath,
        title: selectedConfig.title,
      });
"""

content = pattern_upload.sub(replacement_upload, content)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
