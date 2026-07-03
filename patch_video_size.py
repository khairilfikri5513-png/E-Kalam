import os
import re

units = [
    "UnitOneScreen.tsx",
    "UnitTwoScreen.tsx",
    "UnitThreeScreen.tsx",
    "UnitFourScreen.tsx"
]

for filename in units:
    filepath = os.path.join("src", "pages", "units", filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r") as f:
        content = f.read()

    old_video = """            <VideoWithAudioCheck 
              src={videoUrl} 
              controls 
              playsInline 
              preload="metadata" 
              className="w-full rounded-2xl shadow-lg border border-slate-200" 
            />"""

    new_video = """            <div className="w-full max-w-3xl mx-auto">
              <VideoWithAudioCheck 
                src={videoUrl} 
                controls 
                playsInline 
                preload="metadata" 
                className="w-full max-h-[45vh] object-contain rounded-xl bg-black shadow-lg" 
              />
            </div>"""

    content = content.replace(old_video, new_video)

    with open(filepath, "w") as f:
        f.write(content)

