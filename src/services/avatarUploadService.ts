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
    // 1. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("e-kalam-assets")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from("e-kalam-assets")
      .getPublicUrl(storagePath);

    // Append timestamp to bust cache
    const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

    // 3. Upsert record to app_assets table
    const { error: dbError } = await supabase.from("app_assets").upsert(
      {
        asset_key: assetKey,
        title: title,
        file_path: storagePath,
        public_url: publicUrl,
        asset_type: "avatar",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "asset_key" },
    );

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadAvatarToSupabase:", error);
    throw error;
  }
}
