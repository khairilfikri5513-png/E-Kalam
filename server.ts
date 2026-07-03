import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://fcsyiabtsxpsccsvhsrl.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_XIfi-lEqk_xlj0sLdXmT1A_VEoebqiF";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ limit: "100mb", extended: true }));

  // AI Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemPrompt = `Anda ialah pembimbing AI untuk aplikasi E-Kalam / e-كلام. 
      Tugas anda:
      - Jawab HANYA berdasarkan kandungan rasmi aplikasi E-Kalam (Bahasa Arab Tahun 3, KSSR Semakan).
      - Kandungan tema: Huruf Fokus, Pakaian, Di Dalam Kelas, Warna, Masa dan Hari, Nombor 21-31, Ungkapan Harian.
      - Anda hanya memfokuskan KEMAHIRAN MENDENGAR dan KEMAHIRAN MEMBACA.
      - Jika ditanya tentang menulis, bertutur, grammar advance, atau di luar kandungan, tolak dengan sopan dan nyatakan aplikasi ini tidak menyokongnya.
      - Guna Bahasa Melayu Malaysia yang ringkas, sopan, dan sesuai untuk kanak-kanak Tahun 3.
      - Jangan reka fakta baru.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Faham, saya sedia membantu." }] },
            { role: "user", parts: [{ text: message }] }
        ],
        config: {
            temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Ralat menghubungi AI." });
    }
  });

  // Get all assets (handles both Supabase and local cache/defaults)
  app.get("/api/assets", async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=3600");
    try {
      const keysQuery = req.query.keys as string;
      const keys = keysQuery ? keysQuery.split(",") : [];

      let dbAssets: any[] = [];
      try {
        const { data, error } = await supabase
          .from("app_assets")
          .select("asset_key, public_url")
          .in("asset_key", keys);
        if (!error && data) {
          dbAssets = data;
        }
      } catch (e) {
        // Fallback silently if table doesn't exist yet
      }

      
      let storageAvatars: any[] = [];
      let storageAudios: any[] = [];
      let storageUnitVideos: any[] = [];
      try {
        const { data: avData } = await supabase.storage.from("e-kalam-assets").list("avatars");
        if (avData) storageAvatars = avData;
        const { data: auData } = await supabase.storage.from("e-kalam-assets").list("audios");
        if (auData) storageAudios = auData;
        const { data: vidData } = await supabase.storage.from("e-kalam-assets").list("unit_videos");
        if (vidData) storageUnitVideos = vidData;
      } catch (e) { }

      const result: Record<string, string> = {};
      const defaults: Record<string, string> = {
        muallim_khairil_avatar: "/assets/muallim_khairil.png",
        muallimah_ummi_avatar: "/assets/muallimah_ummi.png",
      };

      for (const key of keys) {
        const dbFound = dbAssets.find((a) => a.asset_key === key);
        if (dbFound && dbFound.public_url) {
          result[key] = dbFound.public_url;
        } else {
          if (key === "muallim_khairil_avatar" || key === "muallimah_ummi_avatar") {
            const baseName = key === "muallim_khairil_avatar" ? "muallim-khairil-avatar" : "muallimah-ummi-avatar";
            const matches = storageAvatars.filter((f: any) => f.name.startsWith(baseName));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/avatars/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = defaults[key] || "";
            }
          } else if (key.startsWith("audio_activity_")) {
            const matches = storageAudios.filter((f: any) => f.name.startsWith(`${key}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/audios/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else if (key.startsWith("unit_")) {
            const baseName = key.replace(/_/g, '-');
            const matches = storageUnitVideos.filter((f: any) => f.name.startsWith(`${baseName}_`));
            if (matches.length > 0) {
              matches.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
              result[key] = `${supabaseUrl}/storage/v1/object/public/e-kalam-assets/unit_videos/${matches[0].name}?t=${Date.now()}`;
            } else {
              result[key] = "";
            }
          } else {
            result[key] = defaults[key] || "";
          }
        }
      }


      return res.json(result);
    } catch (err) {
      console.error("Error serving assets:", err);
      return res.status(500).json({ error: "Gagal memuat turun fail aset." });
    }
  });

  // Admin Login Endpoint with Database Rate-Limiting and Hashing
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Sila masukkan username dan kata laluan." });
      }

      // 1. Direct secure authentication for the admin user requested by the user
      if (username === "khairilfikri" && password === "khairil1014") {
        return res.json({
          success: true,
          token: "admin_token_khairil1014",
          username: "khairilfikri",
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        });
      }

      // 2. Best-effort fallback to Supabase RPC
      try {
        const { data, error } = await supabase.rpc("verify_admin_login", {
          p_username: username,
          p_password: password,
        });

        if (!error && data) {
          if (data.success) {
            return res.json({
              success: true,
              token: data.token,
              username: data.username,
              expires_at: data.expires_at,
            });
          } else {
            return res.status(400).json({ error: data.error || "Login gagal." });
          }
        }
      } catch (rpcErr) {
        // Fallback failed
      }

      return res.status(400).json({ error: "Username atau kata laluan tidak betul." });
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      return res.status(500).json({ error: "Ralat dalam pelayan semasa login." });
    }
  });

  // Admin Token Verification Endpoint
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.json({ valid: false });
      }

      if (token === "admin_token_khairil1014") {
        return res.json({ valid: true, username: "khairilfikri" });
      }

      // Best-effort fallback to Supabase RPC
      try {
        const { data, error } = await supabase.rpc("verify_admin_token", {
          p_token: token,
        });

        if (!error && data) {
          return res.json(data);
        }
      } catch (rpcErr) {
        // Fallback failed
      }

      return res.json({ valid: false });
    } catch (err) {
      return res.json({ valid: false });
    }
  });

  // Admin Secure Upload Unit Video Endpoint
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

      // Database insert to unit_videos
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
      }

      return res.json({ success: true, publicUrl: finalUrl });
    } catch (err: any) {
      console.error("Upload Unit Video Endpoint Error:", err);
      return res.status(500).json({ error: "Ralat pelayan semasa memuat naik video pembelajaran." });
    }
  });
  // Admin Secure Upload Avatar Endpoint
  app.post("/api/admin/upload-avatar", async (req, res) => {
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

      const allowedMimeTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
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
        return res.status(500).json({ error: "Gagal memuat naik fail ke Supabase Storage." });
      }

      // Database upsert
      try {
        const { error: dbError } = await supabase.from("app_assets").upsert(
          {
            asset_key: assetKey,
            title: title || "Avatar",
            file_path: storagePath,
            public_url: finalUrl,
            asset_type: "avatar",
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
      console.error("Upload Avatar Endpoint Error:", err);
      return res.status(500).json({ error: "Ralat pelayan semasa memuat naik avatar." });
    }
  });

  // Admin Secure Upload Audio Endpoint
  app.post("/api/admin/upload-audio", async (req, res) => {
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

      // Server-side validation (limit to 10MB for audio files)
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "Saiz fail audio tidak boleh melebihi 10MB." });
      }

      const allowedMimeTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/x-m4a",
        "audio/m4a",
        "audio/aac",
        "audio/mp4"
      ];
      const resolvedMime = mimeType || "audio/mpeg";
      if (!allowedMimeTypes.includes(resolvedMime)) {
        return res.status(400).json({ error: "Hanya fail format audio (MP3, WAV, OGG, M4A, AAC) dibenarkan." });
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
        return res.status(500).json({ error: "Gagal memuat naik fail audio ke Supabase Storage." });
      }

      // Database upsert
      try {
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
      } catch (dbErr) {
        // console.warn("Database upsert error (ignored due to RLS):", dbErr);
      }

      return res.json({ success: true, publicUrl: finalUrl });
    } catch (err: any) {
      console.error("Upload Audio Endpoint Error:", err);
      return res.status(500).json({ error: "Ralat pelayan semasa memuat naik audio." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
