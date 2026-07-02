import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { uploadAvatarToSupabase } from "../../services/avatarUploadService";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

const avatarOptions = {
  muallim: {
    label: "Muallim Khairil",
    assetKey: "muallim_khairil_avatar",
    storagePath: "avatars/muallim-khairil-avatar.png",
    title: "Avatar Muallim Khairil",
  },
  muallimah: {
    label: "Muallimah Ummi",
    assetKey: "muallimah_ummi_avatar",
    storagePath: "avatars/muallimah-ummi-avatar.png",
    title: "Avatar Muallimah Ummi",
  },
};

export default function AvatarUploadScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as "muallim" | "muallimah";

  const selectedConfig = avatarOptions[typeParam] || avatarOptions.muallim;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchAvatar = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        // 1. Verify token via backend
        const verifyRes = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const verifyResult = await verifyRes.json();

        if (!verifyResult || !verifyResult.valid) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_username");
          navigate("/admin/login");
          return;
        }

        // 2. Fetch current avatar
        const { data, error } = await supabase
          .from("app_assets")
          .select("public_url")
          .eq("asset_key", selectedConfig.assetKey)
          .single();

        if (data && data.public_url) {
          setCurrentAvatarUrl(data.public_url);
        }
      } catch (err) {
        console.warn("Auth / Fetch Avatar Error:", err);
      }
    };

    checkUserAndFetchAvatar();
  }, [selectedConfig.assetKey, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setStatus({
          type: "error",
          message: "Sila pilih fail gambar format PNG, JPG, atau JPEG.",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setStatus({
          type: "error",
          message: "Saiz gambar tidak boleh melebihi 5MB.",
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
        message: "Sila pilih gambar terlebih dahulu.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const url = await uploadAvatarToSupabase({
        file: selectedFile,
        assetKey: selectedConfig.assetKey,
        storagePath: selectedConfig.storagePath,
        title: selectedConfig.title,
      });

      setStatus({ type: "success", message: "Avatar berjaya dikemas kini." });
      setCurrentAvatarUrl(url);

      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Gagal memuat naik avatar.",
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
            Muat Naik Avatar
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {selectedConfig.title}
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Pilih dan muat naik gambar baharu untuk dipaparkan dalam aplikasi.
          </p>

          {/* Status Message */}
          {status && (
            <div
              className={`p-4 rounded-xl mb-6 flex gap-3 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
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
                Pilih Gambar
              </label>

              <div className="relative group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${previewUrl ? "border-blue-300 bg-blue-50" : "border-slate-300 bg-slate-50 group-hover:bg-slate-100 group-hover:border-slate-400"}`}
                >
                  <UploadCloud
                    className={`w-10 h-10 mx-auto mb-3 ${previewUrl ? "text-blue-500" : "text-slate-400"}`}
                  />
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {previewUrl
                      ? "Klik untuk tukar gambar"
                      : "Klik untuk pilih gambar"}
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG sehingga 5MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
                Upload ke Supabase
              </button>
            </div>

            {/* Preview Area */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Preview ({previewUrl ? "Gambar Baharu" : "Avatar Semasa"})
              </label>

              <div className="bg-slate-100 rounded-2xl h-64 border border-slate-200 flex items-center justify-center overflow-hidden p-4 relative">
                {previewUrl || currentAvatarUrl ? (
                  <img
                    src={previewUrl || currentAvatarUrl!}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Tiada avatar</span>
                  </div>
                )}

                {previewUrl && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    BAHARU
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
