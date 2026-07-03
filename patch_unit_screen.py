import re

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "r") as f:
    content = f.read()

upload_pattern = re.compile(r'const formData = new FormData\(\);.*?const result = await response\.json\(\);', re.DOTALL)

new_upload = """    // 1. Convert File to base64
    const base64Promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const result = reader.result as string;
        // Split out the mime-type prefix
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });

    const fileData = await base64Promise;
    const token = localStorage.getItem("admin_token");
    if (!token) {
      throw new Error("Sesi admin tidak ditemui. Sila login semula.");
    }
    
    // 2. Call the secure backend endpoint
    const response = await fetch("/api/admin/upload-unit-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileData,
        assetKey: selectedUnit.id,
        storagePath: dynamicStoragePath,
        title: selectedUnit.title,
        mimeType: selectedFile.type,
      }),
    });

    const result = await response.json();"""

content = upload_pattern.sub(new_upload, content)

with open("src/pages/admin/UnitVideoUploadScreen.tsx", "w") as f:
    f.write(content)
