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

export function useUnitVideo(unitId: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("unit_videos")
        .select("*")
        .eq("unit_id", unitId)
        .eq("status", "active")
        .order("uploaded_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active video found
          setVideoUrl(null);
        } else {
          throw error;
        }
      } else if (data) {
        // We can use the public URL or generate signed URL
        // Since e-kalam-assets is public, we can just use getPublicUrl to be safe
        // Or if video_url is saved, we can use that.
        if (data.video_url) {
          setVideoUrl(data.video_url);
        } else {
          const { data: urlData } = supabase.storage
            .from("e-kalam-assets")
            .getPublicUrl(data.storage_path);
          setVideoUrl(urlData.publicUrl);
        }
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

  return { videoUrl, loading, error, refetch: fetchVideo };
}
