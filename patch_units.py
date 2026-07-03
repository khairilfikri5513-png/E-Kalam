import re
import os

units = {
    "UnitOneScreen.tsx": "unit_1_video",
    "UnitTwoScreen.tsx": "unit_2_video",
    "UnitThreeScreen.tsx": "unit_3_video",
    "UnitFourScreen.tsx": "unit_4_video"
}

for filename, video_key in units.items():
    filepath = os.path.join("src", "pages", "units", filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    # 1. Import Skeleton
    if "Skeleton" not in content:
        content = content.replace(
            "import { UnitHeader }",
            "import { Skeleton } from \"../../components/ui/Skeleton\";\nimport { VideoWithAudioCheck } from \"../../components/VideoWithAudioCheck\";\nimport { UnitHeader }"
        )
    
    # 2. Update useAppAssets
    content = content.replace(
        '["muallimah_ummi_avatar"]',
        f'["muallimah_ummi_avatar", "{video_key}"]'
    )
    
    # Extract loading if not already extracted (useAppAssets returns {assets, loading: assetsLoading})
    # The current one is `const { assets } = useAppAssets(["muallimah_ummi_avatar"]);`
    # Let's change it to `const { assets, loading: assetsLoading } = useAppAssets(["muallimah_ummi_avatar", "{video_key}"]);`
    content = re.sub(
        r'const \{\s*assets\s*\} = useAppAssets',
        'const { assets, loading: assetsLoading } = useAppAssets',
        content
    )

    # 3. Add video below the UnitGuideBubble
    video_block = f"""        {{/* Unit Video Section */}}
        <div className="mb-8">
          {{assetsLoading ? (
            <Skeleton className="w-full aspect-video rounded-2xl shadow-md" />
          ) : assets.{video_key} ? (
            <VideoWithAudioCheck 
              src={{assets.{video_key}}} 
              controls 
              playsInline 
              preload="metadata" 
              className="w-full rounded-2xl shadow-lg border border-slate-200" 
            />
          ) : null}}
        </div>

        {{/* Vocabulary Grid */}}"""

    content = content.replace("{/* Vocabulary Grid */}", video_block)

    with open(filepath, "w") as f:
        f.write(content)

print("Done patching units")
