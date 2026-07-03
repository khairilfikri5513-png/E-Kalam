import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { activitiesData, Activity } from "../../data/mockData";
import { uploadAudioToSupabase } from "../../services/audioUploadService";
import {
  ArrowLeft,
  Volume2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Music,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

export default function AudioUploadScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [uploadedAudios, setUploadedAudios] = useState<Record<string, string>>({});
  
  // Selection and Upload states
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Audio Playback states
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkUserAndFetchAssets = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        let isValid = false;
        if (token === "admin_token_khairil1014") {
          isValid = true;
        } else {
          const { data, error } = await supabase.rpc("verify_admin_token", { p_token: token });
          if (!error && data && data.valid) isValid = true;
        }

        if (!isValid) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_username");
          navigate("/admin/login");
          return;
        }

        // 2. Set activities
        setActivities(activitiesData);

        // 3. Fetch app assets of type 'audio'
        const keys = activitiesData.map(act => `audio_activity_${act.id}`);
        
        const { data, error } = await supabase.from("app_assets").select("asset_key, public_url").in("asset_key", keys);
        if (!error && data) {
           const assetMap: Record<string, string> = {};
           data.forEach(item => { assetMap[item.asset_key] = item.public_url; });
           setUploadedAudios(assetMap);
        }

      } catch (err) {
        console.warn("Auth / Fetch Audio Assets Error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchAssets();
  }, [navigate]);

  const handlePlayAudio = (assetKey: string, url: string) => {
    if (playingKey === assetKey) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingKey(null);
    } else {
      // Stop current
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      setPlayingKey(assetKey);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(err => {
        console.error("Audio playback failed:", err);
        setPlayingKey(null);
      });

      audio.onended = () => {
        setPlayingKey(null);
      };
    }
  };

  // Cleanup audio player on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation
      const validTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/x-m4a",
        "audio/m4a",
        "audio/aac",
        "audio/mp4"
      ];
      if (!validTypes.includes(file.type) && !file.name.endsWith(".mp3") && !file.name.endsWith(".m4a") && !file.name.endsWith(".wav")) {
        setStatus({
          type: "error",
          message: "Sila pilih fail format audio seperti MP3, WAV, OGG, atau M4A.",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setStatus({
          type: "error",
          message: "Saiz audio tidak boleh melebihi 5MB.",
        });
        return;
      }

      setSelectedFile(file);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedActivity) return;
    if (!selectedFile) {
      setStatus({
        type: "error",
        message: "Sila pilih fail audio terlebih dahulu.",
      });
      return;
    }

    setUploadLoading(true);
    setStatus(null);

    const assetKey = `audio_activity_${selectedActivity.id}`;
    const storagePath = `audios/${assetKey}_${Date.now()}.${selectedFile.name.split('.').pop()}`;

    try {
      const url = await uploadAudioToSupabase({
        file: selectedFile,
        assetKey,
        storagePath,
        title: `Audio Latihan ${selectedActivity.title} (${selectedActivity.id})`,
      });

      setStatus({ type: "success", message: "Audio berjaya dikemas kini!" });
      setUploadedAudios(prev => ({ ...prev, [assetKey]: url }));
      setSelectedFile(null);
      
      // Auto-close upload section in 2 seconds
      setTimeout(() => {
        setSelectedActivity(null);
        setStatus(null);
      }, 2000);
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Gagal memuat naik audio.",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 font-bold">Memuat turun data latihan...</p>
      </div>
    );
  }

  const listeningExercises = activities.filter(act => act.skillType === "listening");
  const readingExercises = activities.filter(act => act.skillType === "reading");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative flex flex-col">
      <div className="absolute inset-0 bg-app-pattern opacity-[0.02] pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Pengurusan Audio Latihan</h1>
            <p className="text-slate-500 text-xs">Muat naik dan ganti rakaman audio untuk latihan membaca dan mendengar.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-8 z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left / Middle: List of Activities */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Latihan Mendengar (Listening) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              Latihan Mendengar (Mendengar & Pilih)
            </h2>
            <div className="space-y-4">
              {listeningExercises.map(act => {
                const assetKey = `audio_activity_${act.id}`;
                const audioUrl = uploadedAudios[assetKey];
                const isSelected = selectedActivity?.id === act.id;

                return (
                  <div 
                    key={act.id} 
                    className={`border rounded-xl p-4 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isSelected ? "border-blue-400 bg-blue-50/20" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px] uppercase">
                          ID: {act.id}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm">Teks Arab:</h3>
                        <span className="font-arabic text-xl font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded" dir="rtl">
                          {act.arabicText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Arahan: {act.instruction}</p>
                      <p className="text-xs text-slate-500 mt-1">Jawapan betul: <strong className="text-green-600 font-arabic text-sm">{act.correctAnswer}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
                      {audioUrl ? (
                        <button
                          onClick={() => handlePlayAudio(assetKey, audioUrl)}
                          className={`p-2.5 rounded-lg border text-sm flex items-center gap-1.5 transition-all ${
                            playingKey === assetKey 
                              ? "bg-amber-100 text-amber-700 border-amber-300 animate-pulse" 
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {playingKey === assetKey ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span className="text-xs font-bold">Dengar</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 text-slate-300" /> Auto Robot TTS
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedActivity(act);
                          setSelectedFile(null);
                          setStatus(null);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {audioUrl ? "Tukar Audio" : "Muat Naik"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latihan Membaca (Reading) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-purple-500 rounded-full inline-block"></span>
              Latihan Membaca (Baca & Padankan)
            </h2>
            <div className="space-y-4">
              {readingExercises.map(act => {
                const assetKey = `audio_activity_${act.id}`;
                const audioUrl = uploadedAudios[assetKey];
                const isSelected = selectedActivity?.id === act.id;

                return (
                  <div 
                    key={act.id} 
                    className={`border rounded-xl p-4 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isSelected ? "border-purple-400 bg-purple-50/20" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px] uppercase">
                          ID: {act.id}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm">Teks Arab:</h3>
                        <span className="font-arabic text-xl font-bold text-purple-600 px-2 py-0.5 bg-purple-50 rounded" dir="rtl">
                          {act.arabicText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Arahan: {act.instruction}</p>
                      <p className="text-xs text-slate-500 mt-1">Jawapan betul: <strong className="text-green-600 font-arabic text-sm">{act.correctAnswer}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
                      {audioUrl ? (
                        <button
                          onClick={() => handlePlayAudio(assetKey, audioUrl)}
                          className={`p-2.5 rounded-lg border text-sm flex items-center gap-1.5 transition-all ${
                            playingKey === assetKey 
                              ? "bg-amber-100 text-amber-700 border-amber-300 animate-pulse" 
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {playingKey === assetKey ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span className="text-xs font-bold">Dengar</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 text-slate-300" /> Auto Robot TTS
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setSelectedActivity(act);
                          setSelectedFile(null);
                          setStatus(null);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                          isSelected 
                            ? "bg-purple-600 text-white" 
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {audioUrl ? "Tukar Audio" : "Muat Naik"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Pane: Upload Area */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-28">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-500" />
              Panel Muat Naik
            </h2>

            {selectedActivity ? (
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Aktiviti Dipilih</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500 font-bold bg-slate-200 px-2 py-0.5 rounded uppercase">
                      ID: {selectedActivity.id}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {selectedActivity.skillType === "listening" ? "Latihan Mendengar" : "Latihan Membaca"}
                    </span>
                  </div>
                  <div className="mt-3 text-center py-2 bg-white rounded border border-slate-150">
                    <p className="font-arabic text-2xl text-slate-800 font-bold" dir="rtl">
                      {selectedActivity.arabicText}
                    </p>
                  </div>
                </div>

                {/* Dropzone / File Picker */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    disabled={uploadLoading}
                  />
                  
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
                    {selectedFile ? (
                      <div className="w-full">
                        <p className="text-xs font-bold text-blue-600 truncate px-2" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-700">Klik atau heret fail audio</p>
                        <p className="text-[10px] text-slate-400 mt-1">MP3, WAV, M4A (Maks 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {status && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                      status.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    )}
                    <span className="font-semibold">{status.message}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setSelectedActivity(null);
                      setSelectedFile(null);
                      setStatus(null);
                    }}
                    disabled={uploadLoading}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadLoading}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memuat naik...</span>
                      </>
                    ) : (
                      <>
                        <span>Simpan Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-xl">
                <Volume2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-600">Tiada latihan dipilih</p>
                <p className="text-[11px] text-slate-400 mt-1">Sila klik butang "Muat Naik" atau "Tukar Audio" pada mana-mana latihan di sebelah kiri.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
