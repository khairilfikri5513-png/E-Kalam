import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface UnitVideoData {
  id: string;
  unit_id: string;
  title: string;
  file_name: string;
  storage_path: string;
  video_url: string;
  mime_type: string;
  file_size: number;
  status: string;
}

const videoCache: Record<string, { url: string | null; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export function useUnitVideo(unitId: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = async (force = false) => {
    if (!force) {
      const cached = videoCache[unitId];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setVideoUrl(cached.url);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("unit_videos")
        .select("id, title, storage_path, video_url, mime_type, status, uploaded_at")
        .eq("unit_id", unitId)
        .eq("status", "active")
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active video found
          setVideoUrl(null);
          videoCache[unitId] = { url: null, timestamp: Date.now() };
        } else {
          throw error;
        }
      } else if (data) {
        let finalUrl = data.video_url;
        if (!finalUrl) {
          const { data: urlData } = supabase.storage
            .from("e-kalam-assets")
            .getPublicUrl(data.storage_path);
          finalUrl = urlData.publicUrl;
        }
        setVideoUrl(finalUrl);
        videoCache[unitId] = { url: finalUrl, timestamp: Date.now() };
      }
    } catch (err: any) {
      console.error("Failed to fetch unit video:", err);
      setError("Ralat semasa memuatkan video pembelajaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [unitId]);

  return { videoUrl, loading, error, refetch: () => fetchVideo(true) };
}
