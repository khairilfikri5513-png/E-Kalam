import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  // Admin Login Endpoint with Database Rate-Limiting and Hashing
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Sila masukkan username dan kata laluan." });
      }

      const { data, error } = await supabase.rpc("verify_admin_login", {
        p_username: username,
        p_password: password,
      });

      if (error) {
        console.error("Login RPC Error:", error);
        return res.status(500).json({ error: "Ralat sambungan ke pangkalan data." });
      }

      if (!data || !data.success) {
        return res.status(400).json({ error: data?.error || "Login gagal." });
      }

      return res.json({
        success: true,
        token: data.token,
        username: data.username,
        expires_at: data.expires_at,
      });
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

      const { data, error } = await supabase.rpc("verify_admin_token", {
        p_token: token,
      });

      if (error || !data) {
        return res.json({ valid: false });
      }

      return res.json(data);
    } catch (err) {
      return res.json({ valid: false });
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

      // Server-side verification of admin token
      const { data: verifyData, error: verifyError } = await supabase.rpc("verify_admin_token", {
        p_token: token,
      });

      if (verifyError || !verifyData || !verifyData.valid) {
        return res.status(401).json({ error: "Sesi admin tidak sah atau telah tamat." });
      }

      const { fileData, assetKey, storagePath, title, mimeType } = req.body;

      if (!fileData || !assetKey || !storagePath) {
        return res.status(400).json({ error: "Butiran fail tidak lengkap." });
      }

      // Convert Base64 back to binary Buffer
      const buffer = Buffer.from(fileData, "base64");

      // Server-side validation
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: "Saiz fail tidak boleh melebihi 5MB." });
      }

      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
      const resolvedMime = mimeType || "image/png";
      if (!allowedMimeTypes.includes(resolvedMime)) {
        return res.status(400).json({ error: "Hanya fail format PNG, JPG, dan JPEG dibenarkan." });
      }

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("e-kalam-assets")
        .upload(storagePath, buffer, {
          contentType: resolvedMime,
          upsert: true,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return res.status(500).json({ error: `Gagal memuat naik fail: ${uploadError.message}` });
      }

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("e-kalam-assets")
        .getPublicUrl(storagePath);

      const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

      // 3. Securely upsert to app_assets table on behalf of the verified admin
      const { error: dbError } = await supabase.from("app_assets").upsert(
        {
          asset_key: assetKey,
          title: title || "Avatar",
          file_path: storagePath,
          public_url: publicUrl,
          asset_type: "avatar",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "asset_key" }
      );

      if (dbError) {
        console.error("Database upsert error:", dbError);
        return res.status(500).json({ error: `Gagal menyimpan rekod pangkalan data: ${dbError.message}` });
      }

      return res.json({ success: true, publicUrl });
    } catch (err: any) {
      console.error("Upload Avatar Endpoint Error:", err);
      return res.status(500).json({ error: "Ralat pelayan semasa memuat naik avatar." });
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
