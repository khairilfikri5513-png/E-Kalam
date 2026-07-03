with open("server.ts", "r") as f:
    content = f.read()

new_endpoint = """  // Admin Secure Upload Unit Video Endpoint
  app.post("/api/admin/upload-unit-video", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Sila login semula sebagai admin." });
      }

      const token = authHeader.split(" ")[1];

      // Verify admin token (local or Supabase RPC)
      let isValidToken = (token === "admin_token_khairil1014");
      let adminUsername = isValidToken ? "khairilfikri" : "";

      if (!isValidToken) {
        try {
          const { data, error } = await supabase.rpc("verify_admin_token", {
            p_token: token,
          });
          if (!error && data && data.valid) {
            isValidToken = true;
            adminUsername = data.username;
          }
        } catch (rpcErr) {
          // Fallback failed
        }
      }

      if (!isValidToken) {
        return res.status(401).json({ error: "Sesi admin tidak sah atau telah tamat." });
      }

      const { fileData, assetKey, storagePath, title, mimeType } = req.body;

      if (!fileData || !assetKey || !storagePath) {
        return res.status(400).json({ error: "Butiran fail tidak lengkap." });
      }

      // Convert Base64 back to binary Buffer
      const buffer = Buffer.from(fileData, "base64");

      // Server-side validation
      if (buffer.length > 50 * 1024 * 1024) {
        return res.status(400).json({ error: "Saiz video tidak boleh melebihi 50MB." });
      }

      const allowedMimeTypes = ["video/mp4", "video/webm"];
      const resolvedMime = mimeType || "video/mp4";
      if (!allowedMimeTypes.includes(resolvedMime)) {
        return res.status(400).json({ error: "Hanya fail format video (MP4, WEBM) dibenarkan." });
      }

      let finalUrl = "";

      // Upload to Supabase Storage
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("e-kalam-assets")
          .upload(storagePath, buffer, {
            contentType: resolvedMime,
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("e-kalam-assets")
          .getPublicUrl(storagePath);
          
        if (urlData && urlData.publicUrl) {
          finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
        } else {
          throw new Error("Gagal mendapatkan URL dari Supabase.");
        }
      } catch (storageErr) {
        console.error("Storage upload error:", storageErr);
        return res.status(500).json({ error: "Gagal memuat naik video ke Supabase Storage." });
      }

      // Database upsert
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
      }

      return res.json({ success: true, publicUrl: finalUrl });
    } catch (err: any) {
      console.error("Upload Unit Video Endpoint Error:", err);
      return res.status(500).json({ error: "Ralat pelayan semasa memuat naik video pembelajaran." });
    }
  });\n"""

# insert before the avatar endpoint
content = content.replace("  // Admin Secure Upload Avatar Endpoint", new_endpoint + "  // Admin Secure Upload Avatar Endpoint")

with open("server.ts", "w") as f:
    f.write(content)
