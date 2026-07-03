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
    
    if "import { VocabularySkeletonGrid }" not in content:
        content = content.replace(
            "import { VocabularyCard } from \"../../components/units/VocabularyCard\";",
            "import { VocabularyCard } from \"../../components/units/VocabularyCard\";\nimport { VocabularySkeletonGrid } from \"../../components/units/VocabularySkeletonGrid\";"
        )

    with open(filepath, "w") as f:
        f.write(content)
