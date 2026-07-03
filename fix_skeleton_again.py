import os

for filename in ["UnitThreeScreen.tsx", "UnitFourScreen.tsx"]:
    filepath = os.path.join("src", "pages", "units", filename)
    with open(filepath, "r") as f:
        content = f.read()
    
    if "import { VocabularySkeletonGrid }" not in content:
        content = content.replace(
            "import { VocabularyDetailModal } from \"../../components/units/VocabularyDetailModal\";",
            "import { VocabularyDetailModal } from \"../../components/units/VocabularyDetailModal\";\nimport { VocabularySkeletonGrid } from \"../../components/units/VocabularySkeletonGrid\";"
        )

    with open(filepath, "w") as f:
        f.write(content)
