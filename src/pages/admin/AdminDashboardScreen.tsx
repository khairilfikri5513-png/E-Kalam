import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { LogOut, Image as ImageIcon, Upload, ShieldCheck, Music } from "lucide-react";
import MuallimKhairilAvatarLocal from "../../assets/images/muallim-khairil-avatar.png";
import MuallimahUmmiAvatarLocal from "../../assets/images/muallimah-ummi-avatar.png";

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [muallimAvatar, setMuallimAvatar] = useState<string | null>(null);
  const [muallimahAvatar, setMuallimahAvatar] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchAvatars = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await fetch("/api/admin/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result && result.valid) {
          setLoading(false);
          
          // Fetch uploaded avatars
          const { data: muallimData } = await supabase
            .from("app_assets")
            .select("public_url")
            .eq("asset_key", "muallim_khairil_avatar")
            .maybeSingle();
            
          if (muallimData?.public_url) {
            setMuallimAvatar(muallimData.public_url);
          }

          const { data: muallimahData } = await supabase
            .from("app_assets")
            .select("public_url")
            .eq("asset_key", "muallimah_ummi_avatar")
            .maybeSingle();
            
          if (muallimahData?.public_url) {
            setMuallimahAvatar(muallimahData.public_url);
          }
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_username");
          navigate("/admin/login");
        }
      } catch (err) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_username");
        navigate("/admin/login");
      }
    };

    checkUserAndFetchAvatars();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 text-xs">E-Kalam | e-كلام</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Pengurusan Kandungan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Menu 1 */}
          <button
            onClick={() => navigate("/admin/upload-avatar?type=muallim")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group flex flex-col justify-between h-full min-h-[180px]"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                
                {/* Visual Avatar Preview */}
                <div className="w-14 h-14 rounded-xl border border-slate-150 bg-slate-50 overflow-hidden flex items-center justify-center shadow-inner relative group-hover:border-blue-300 transition-colors">
                  <img
                    src={muallimAvatar || MuallimKhairilAvatarLocal}
                    alt="Muallim Khairil"
                    className="w-full h-full object-contain p-1 drop-shadow-sm"
                  />
                  {muallimAvatar && (
                    <span className="absolute bottom-0 right-0 left-0 bg-green-500 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                      Uploaded
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Upload Avatar Muallim Khairil
              </h3>
              <p className="text-slate-500 text-sm">
                Kemaskini gambar avatar Muallim Khairil untuk Hero Section dan AI
                Pembimbing.
              </p>
            </div>
          </button>

          {/* Menu 2 */}
          <button
            onClick={() => navigate("/admin/upload-avatar?type=muallimah")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all text-left group flex flex-col justify-between h-full min-h-[180px]"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                
                {/* Visual Avatar Preview */}
                <div className="w-14 h-14 rounded-xl border border-slate-150 bg-slate-50 overflow-hidden flex items-center justify-center shadow-inner relative group-hover:border-purple-300 transition-colors">
                  <img
                    src={muallimahAvatar || MuallimahUmmiAvatarLocal}
                    alt="Muallimah Ummi"
                    className="w-full h-full object-contain p-1 drop-shadow-sm"
                  />
                  {muallimahAvatar && (
                    <span className="absolute bottom-0 right-0 left-0 bg-green-500 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                      Uploaded
                    </span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Upload Avatar Muallimah Ummi
              </h3>
              <p className="text-slate-500 text-sm">
                Kemaskini gambar avatar Muallimah Ummi untuk seksyen Kandungan
                Pembelajaran.
              </p>
            </div>
          </button>

          {/* Menu 3: Manage Audios */}
          <button
            onClick={() => navigate("/admin/upload-audio")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all text-left group flex flex-col justify-between h-full min-h-[180px]"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-6 h-6" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Muat Naik Audio Latihan
              </h3>
              <p className="text-slate-500 text-sm">
                Urus dan muat naik rakaman suara sebenar untuk Latihan Membaca & Latihan Mendengar.
              </p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
          >
            Lihat Aplikasi (Preview)
          </button>
        </div>
      </div>
    </div>
  );
}
