import { supabase } from "../lib/supabase";

interface UploadAvatarParams {
  file: File;
  assetKey: string;
  storagePath: string;
  title: string;
}

export async function uploadAvatarToSupabase({
  file,
  assetKey,
  storagePath,
  title,
}: UploadAvatarParams) {
  try {
    // 1. Convert File to base64
    const base64Promise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Split out the mime-type prefix (e.g. "data:image/png;base64,")
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
    const response = await fetch("/api/admin/upload-avatar", {
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
      throw new Error(result.error || "Gagal memuat naik avatar.");
    }

    return result.publicUrl;
  } catch (error: any) {
    console.warn("Error in uploadAvatarToSupabase:", error);
    throw error;
  }
}
