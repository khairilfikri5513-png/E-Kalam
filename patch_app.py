import re

with open("src/App.tsx", "r") as f:
    content = f.read()

if "import UnitVideoUploadScreen" not in content:
    content = content.replace(
        "import AudioUploadScreen from './pages/admin/AudioUploadScreen';",
        "import AudioUploadScreen from './pages/admin/AudioUploadScreen';\nimport UnitVideoUploadScreen from './pages/admin/UnitVideoUploadScreen';"
    )
    
if '<Route path="/admin/upload-unit-video"' not in content:
    content = content.replace(
        '<Route path="/admin/upload-audio" element={<AudioUploadScreen />} />',
        '<Route path="/admin/upload-audio" element={<AudioUploadScreen />} />\n        <Route path="/admin/upload-unit-video" element={<UnitVideoUploadScreen />} />'
    )

with open("src/App.tsx", "w") as f:
    f.write(content)
