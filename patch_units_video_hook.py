import os
import re

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
    
    # 1. Import useUnitVideo
    if "import { useUnitVideo }" not in content:
        content = content.replace(
            "import { useAppAssets } from \"../../hooks/useAppAssets\";",
            "import { useAppAssets } from \"../../hooks/useAppAssets\";\nimport { useUnitVideo } from \"../../hooks/useUnitVideo\";"
        )
    
    # 2. Modify useAppAssets array to remove video_key
    # It currently is something like: `const { assets, loading: assetsLoading } = useAppAssets(["muallimah_ummi_avatar", "unit_1_video"]);`
    content = re.sub(
        r'useAppAssets\(\["muallimah_ummi_avatar",\s*"[^"]+"\]\);',
        'useAppAssets(["muallimah_ummi_avatar"]);',
        content
    )

    # 3. Add useUnitVideo call
    hook_str = f'  const {{ videoUrl, loading: videoLoading, error: videoError }} = useUnitVideo("{video_key}");'
    if hook_str not in content:
        content = re.sub(
            r'(const \{ assets, loading: assetsLoading \} = useAppAssets\(\["muallimah_ummi_avatar"\]\);)',
            r'\1\n' + hook_str,
            content
        )

    # 4. Modify the Video section
    old_video_block = f"""        {{/* Unit Video Section */}}
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
        </div>"""

    new_video_block = f"""        {{/* Unit Video Section */}}
        <div className="mb-8">
          {{videoLoading ? (
            <Skeleton className="w-full aspect-video rounded-2xl shadow-md" />
          ) : videoError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-sm border border-red-100">
              {{videoError}}
            </div>
          ) : videoUrl ? (
            <VideoWithAudioCheck 
              src={{videoUrl}} 
              controls 
              playsInline 
              preload="metadata" 
              className="w-full rounded-2xl shadow-lg border border-slate-200" 
            />
          ) : (
            <div className="bg-slate-100 text-slate-500 p-8 rounded-2xl text-center text-sm border border-slate-200">
              Tiada video tersedia untuk unit ini.
            </div>
          )}}
        </div>"""

    content = content.replace(old_video_block, new_video_block)

    with open(filepath, "w") as f:
        f.write(content)

