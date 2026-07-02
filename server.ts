import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
