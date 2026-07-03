import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, Loader2, Video as VideoIcon, ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { uploadAvatarToSupabase } from "../../services/avatarUploadService"; // We can reuse this since it uploads to app_assets
import { VideoWithAudioCheck } from "../../components/VideoWithAudioCheck";

const unitConfigs = [
  {
    id: "unit_1_video",
    label: "Unit 1: Sila Masuk ke Kelas",
    title: "Video Pembelajaran Unit Pertama",
  },
  {
    id: "unit_2_video",
    label: "Unit 2: Pakaian Cantik Saya",
    title: "Video Pembelajaran Unit Kedua",
  },
  {
    id: "unit_3_video",
    label: "Unit 3: Warna-warni di Sekeliling Kita",
    title: "Video Pembelajaran Unit Ketiga",
  },
  {
    id: "unit_4_video",
    label: "Unit 4: Masa Itu Emas",
    title: "Video Pembelajaran Unit Keempat",
  },
];

export default function UnitVideoUploadScreen() {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState(unitConfigs[0]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [historyVideos, setHistoryVideos] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const { data, error } = await supabase
          .from("unit_videos")
          .select("*")
          .eq("unit_id", selectedUnit.id)
          .order("uploaded_at", { ascending: false });
        if (data) {
          setHistoryVideos(data);
        }
      } catch (err) {
        console.warn("Failed to fetch history", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    const checkUserAndFetchVideo = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        // Fetch current video URL from DB
        const { data, error } = await supabase
          .from("unit_videos")
          .select("video_url")
          .eq("unit_id", selectedUnit.id)
          .eq("status", "active")
          .order("uploaded_at", { ascending: false })
          .limit(1)
          .single();
          
        if (data && data.video_url) {
          setCurrentVideoUrl(data.video_url);
        } else {
          setCurrentVideoUrl(null);
        }
        fetchHistory();
      } catch (err) {
        console.warn("Auth / Fetch Video Error:", err);
      }
    };

    setCurrentVideoUrl(null); // Reset when unit changes
    setHistoryVideos([]);
    checkUserAndFetchVideo();
  }, [selectedUnit.id, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation
      const validVideoTypes = ["video/mp4", "video/webm"];
      const isVideo = validVideoTypes.includes(file.type);
      
      if (!isVideo) {
        setStatus({
          type: "error",
          message: "Hanya fail video MP4 atau WebM dibenarkan untuk video pembelajaran.",
        });
        return;
      }

      if (isVideo && file.size > 50 * 1024 * 1024) {
        setStatus({
          type: "error",
          message: "Saiz video tidak boleh melebihi 50MB. (Egress Supabase Free Plan limit)",
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({
        type: "error",
        message: "Sila pilih video terlebih dahulu.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const ext = selectedFile.name.split('.').pop() || 'mp4';
      const baseName = selectedUnit.id.replace(/_/g, '-');
      const dynamicStoragePath = `unit_videos/${baseName}_${Date.now()}.${ext}`;

      // Reusing the avatarUploadService because it's a generic supabase asset uploader under the hood
      // We pass the new storagePath and assetKey
      // Wait, avatarUploadService calls `/api/admin/upload-avatar` which hardcodes something? Let's check it.
      // We will create a new upload method if needed, but let's check `uploadAvatarToSupabase` implementation later.
      // Or we can just do the upload directly to Supabase storage if we have RLS enabled, but backend handles it.
      
      // Let's implement direct upload via fetch to our own api endpoint for unit videos, or use the avatar one if it accepts arbitrary keys.
          // 1. Convert File to base64
      const { data: uploadData, error: uploadError } = await supabase.storage.from("e-kalam-assets").upload(dynamicStoragePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl(dynamicStoragePath);
      const finalUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;
      const adminUsername = localStorage.getItem("admin_username") || "admin";
      const { error: dbError } = await supabase.from("unit_videos").insert({
          unit_id: selectedUnit.id,
          title: selectedUnit.title,
          file_name: selectedFile.name,
          storage_path: dynamicStoragePath,
          video_url: finalUrl,
          mime_type: selectedFile.type,
          file_size: selectedFile.size,
          uploaded_by: adminUsername,
          status: "active"
      });
      if (dbError) throw dbError;

      setStatus({ type: "success", message: `Video berjaya dimuat naik untuk ${selectedUnit.label}.` });
      setCurrentVideoUrl(finalUrl);
      
      // Refresh history
      const { data, error } = await supabase
        .from("unit_videos")
        .select("*")
        .eq("unit_id", selectedUnit.id)
        .order("uploaded_at", { ascending: false });
      if (data) {
        setHistoryVideos(data);
      }

      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Gagal memuat naik video.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mr-4 p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-slate-800 text-lg flex-1">
            Muat Naik Video Pembelajaran
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        
        {/* Unit Selector */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Pilih Unit Pembelajaran
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unitConfigs.map((unit) => (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit);
                  setSelectedFile(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setStatus(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedUnit.id === unit.id
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      selectedUnit.id === unit.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <VideoIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${selectedUnit.id === unit.id ? "text-emerald-800" : "text-slate-700"}`}>
                      {unit.label.split(":")[0]}
                    </h3>
                    <p className={`text-xs ${selectedUnit.id === unit.id ? "text-emerald-600" : "text-slate-500"}`}>
                      {unit.label.split(":")[1]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {selectedUnit.title}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Pilih dan muat naik video pembelajaran untuk unit ini.
          </p>

          {/* Status Message */}
          {status && (
            <div
              className={`p-4 rounded-xl mb-6 flex gap-3 ${
                status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Pilih Video
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="video/mp4, video/webm"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                    previewUrl ? "border-emerald-300 bg-emerald-50" : "border-slate-300 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-400"
                  }`}
                >
                  <UploadCloud
                    className={`w-10 h-10 mx-auto mb-3 ${previewUrl ? "text-emerald-500" : "text-slate-400"}`}
                  />
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {previewUrl
                      ? "Klik untuk tukar video"
                      : "Klik untuk pilih video"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Video (MP4, WEBM) max 50MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
                Upload Video ke Supabase
              </button>
            </div>

            {/* Preview Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Preview ({previewUrl ? "Video Baharu" : "Video Semasa"})
              </label>

              <div className="bg-slate-100 rounded-2xl h-64 border border-slate-200 flex items-center justify-center overflow-hidden p-4 relative">
                {previewUrl || currentVideoUrl ? (
                  <VideoWithAudioCheck 
                    src={previewUrl || currentVideoUrl!} 
                    controls 
                    playsInline 
                    preload="metadata" 
                    className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg" 
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <VideoIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium text-center">Tiada video pembelajaran</span>
                  </div>
                )}

                {previewUrl && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    BAHARU
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Senarai Video Terdahulu</h3>
          
          {loadingHistory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-slate-100 h-64 rounded-xl"></div>
              ))}
            </div>
          ) : historyVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historyVideos.map((video) => {
                const videoUrl = video.video_url;
                return (
                  <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col relative">
                    {video.status === 'active' && (
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        AKTIF
                      </div>
                    )}
                    <div className="bg-slate-200 h-48 relative flex items-center justify-center">
                      <VideoWithAudioCheck
                        src={videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="max-w-full max-h-full"
                      />
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 text-sm">
                      <div className="font-bold text-slate-800 break-all line-clamp-2" title={video.file_name}>{video.file_name}</div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Unit:</span> {selectedUnit.label}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Jenis Fail:</span> {video.mime_type}
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Saiz Fail:</span> {(video.file_size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div className="text-slate-600">
                        <span className="font-semibold">Tarikh Upload:</span> {new Date(video.uploaded_at).toLocaleString('ms-MY')}
                      </div>
                      <div className="text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Berjaya diupload ({video.status})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Tiada rekod video terdahulu untuk unit ini.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
