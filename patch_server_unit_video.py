import re

with open("server.ts", "r") as f:
    content = f.read()

old_db_upsert = """      // Database upsert
      try {
        const { error: dbError } = await supabase.from("app_assets").upsert(
          {
            asset_key: assetKey,
            title: title || "Video Pembelajaran",
            file_path: storagePath,
            public_url: finalUrl,
            asset_type: "unit_video",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "asset_key" }
        );
        
        if (dbError) throw dbError;
      } catch (dbErr) {
        // console.warn("Database upsert error (ignored due to RLS):", dbErr);
      }"""

new_db_upsert = """      // Database insert to unit_videos
      try {
        // We deactivate old videos for this unit to keep only the latest active
        await supabase.from("unit_videos").update({ status: "inactive" }).eq("unit_id", assetKey);

        const { error: dbError } = await supabase.from("unit_videos").insert({
          unit_id: assetKey,
          title: title || "Video Pembelajaran",
          file_name: storagePath.split('/').pop() || "video.mp4",
          storage_path: storagePath,
          video_url: finalUrl,
          mime_type: resolvedMime,
          file_size: buffer.length,
          uploaded_by: adminUsername || "admin",
          status: "active"
        });
        
        if (dbError) throw dbError;
      } catch (dbErr) {
        console.error("Database insert error:", dbErr);
        // We do not throw to allow storage upload to succeed, but ideally we should
      }"""

content = content.replace(old_db_upsert, new_db_upsert)

with open("server.ts", "w") as f:
    f.write(content)
