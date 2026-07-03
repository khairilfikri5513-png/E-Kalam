import re

with open("src/services/audioUploadService.ts", "r") as f:
    content = f.read()

old_logic = """  try {
    // 1. Convert File to base64
    const base64Promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
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
    const response = await fetch("/api/admin/upload-audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileData,
        assetKey,
        storagePath,
        title,
        mimeType: file.type,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Gagal memuat naik audio.");
    }

    return result.publicUrl;
  } catch (error: any) {
    console.warn("Error in uploadAudioToSupabase:", error);
    throw error;
  }"""

new_logic = """  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("e-kalam-assets")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("e-kalam-assets")
      .getPublicUrl(storagePath);
      
    if (!urlData) throw new Error("Gagal mendapatkan URL public.");

    const finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

    const { error: dbError } = await supabase.from("app_assets").upsert(
      {
        asset_key: assetKey,
        title: title || "Audio",
        file_path: storagePath,
        public_url: finalUrl,
        asset_type: "audio",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "asset_key" }
    );
    
    if (dbError) throw dbError;

    return finalUrl;
  } catch (error: any) {
    console.warn("Error in uploadAudioToSupabase:", error);
    throw error;
  }"""

content = content.replace(old_logic, new_logic)

with open("src/services/audioUploadService.ts", "w") as f:
    f.write(content)
