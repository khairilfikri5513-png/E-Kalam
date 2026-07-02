import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { LogOut, Image as ImageIcon, Upload, ShieldCheck } from "lucide-react";

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
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

    checkUser();
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menu 1 */}
          <button
            onClick={() => navigate("/admin/upload-avatar?type=muallim")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Upload Avatar Muallim Khairil
            </h3>
            <p className="text-slate-500 text-sm">
              Kemaskini gambar avatar Muallim Khairil untuk Hero Section dan AI
              Pembimbing.
            </p>
          </button>

          {/* Menu 2 */}
          <button
            onClick={() => navigate("/admin/upload-avatar?type=muallimah")}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Upload Avatar Muallimah Ummi
            </h3>
            <p className="text-slate-500 text-sm">
              Kemaskini gambar avatar Muallimah Ummi untuk seksyen Kandungan
              Pembelajaran.
            </p>
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
