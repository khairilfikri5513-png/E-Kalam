import re

with open("src/pages/admin/AvatarUploadScreen.tsx", "r") as f:
    content = f.read()

if "import { VideoWithAudioCheck }" not in content:
    content = content.replace(
        'import { uploadAvatarToSupabase } from "../../services/avatarUploadService";',
        'import { uploadAvatarToSupabase } from "../../services/avatarUploadService";\nimport { VideoWithAudioCheck } from "../../components/VideoWithAudioCheck";'
    )

content = content.replace(
    '<video src={previewUrl || currentAvatarUrl!} controls playsInline preload="metadata" className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg">Browser anda tidak menyokong tag video.</video>',
    '<VideoWithAudioCheck src={previewUrl || currentAvatarUrl!} controls playsInline preload="metadata" className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg" />'
)

content = content.replace(
    '<video\n                        src={videoUrl}\n                        controls\n                        playsInline\n                        preload="metadata"\n                        className="max-w-full max-h-full"\n                      >\n                        Browser anda tidak menyokong tag video.\n                      </video>',
    '<VideoWithAudioCheck src={videoUrl} controls playsInline preload="metadata" className="max-w-full max-h-full" />'
)

with open("src/pages/admin/AvatarUploadScreen.tsx", "w") as f:
    f.write(content)
