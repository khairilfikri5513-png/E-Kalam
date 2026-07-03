import os

units = [
    "UnitOneScreen.tsx",
    "UnitTwoScreen.tsx",
    "UnitThreeScreen.tsx",
    "UnitFourScreen.tsx"
]

for filename in units:
    filepath = os.path.join("src", "pages", "units", filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    if "import { Skeleton }" not in content:
        content = content.replace(
            "import { UnitHeader } from \"../../components/units/UnitHeader\";",
            "import { Skeleton } from \"../../components/ui/Skeleton\";\nimport { VideoWithAudioCheck } from \"../../components/VideoWithAudioCheck\";\nimport { UnitHeader } from \"../../components/units/UnitHeader\";"
        )

    with open(filepath, "w") as f:
        f.write(content)

