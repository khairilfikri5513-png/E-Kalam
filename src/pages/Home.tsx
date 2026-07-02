import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Headphones, BookOpen, Trophy, Bot, 
  ChevronRight, School, Shirt, Palette, Clock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAppAssets } from '../hooks/useAppAssets';
import MuallimKhairilAvatarLocal from "../assets/images/muallim-khairil-avatar.png";
import MuallimahUmmiAvatarLocal from "../assets/images/muallimah-ummi-avatar.png";

const contentsUnits = [

  {
    id: 1,
    unit: "الوحدة الأولى",
    title: "تفضل إلى الفصل",
    theme: "Kelas",
    icon: School,
    gradient: "from-sky-400 to-blue-400",
    shadow: "shadow-blue-500/30",
    shape: "rounded-3xl"
  },
  {
    id: 2,
    unit: "الوحدة الثانية",
    title: "ملابسي الجميلة",
    theme: "Pakaian",
    icon: Shirt,
    gradient: "from-green-400 to-emerald-500",
    shadow: "shadow-green-500/30",
    shape: "rounded-3xl"
  },
  {
    id: 3,
    unit: "الوحدة الثالثة",
    title: "الألوان حولنا",
    theme: "Warna",
    icon: Palette,
    gradient: "from-pink-300 to-rose-400",
    shadow: "shadow-pink-500/30",
    shape: "rounded-3xl"
  },
  {
    id: 4,
    unit: "الوحدة الرابعة",
    title: "الوقت كالذهب",
    theme: "Masa",
    icon: Clock,
    gradient: "from-yellow-400 to-orange-400",
    shadow: "shadow-orange-500/30",
    shape: "rounded-3xl"
  },
  {
    id: 5,
    unit: "قائمة المفردات",
    title: "Senarai Kosa Kata",
    theme: "Kosa Kata",
    icon: BookOpen,
    gradient: "from-purple-300 to-violet-400",
    shadow: "shadow-purple-500/30",
    shape: "rounded-3xl"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { assets } = useAppAssets(['muallim_khairil_avatar', 'muallimah_ummi_avatar']);

  const muallimKhairilAvatar = assets.muallim_khairil_avatar || MuallimKhairilAvatarLocal;
  const muallimahUmmiAvatar = assets.muallimah_ummi_avatar || MuallimahUmmiAvatarLocal;

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

  const featureCards = [
    {
      id: "listen",
      title: "Latihan Mendengar",
      description: "Dengar dan faham perkataan dan ayat Bahasa Arab.",
      icon: Headphones,
      gradient: "from-blue-600 to-cyan-400",
      shadowColor: "shadow-cyan-500/30",
      iconColor: "text-blue-50",
      bgIcon: "bg-white/20",
      path: "/listen"
    },
    {
      id: "read",
      title: "Latihan Membaca",
      description: "Baca perkataan dan ayat mudah dengan betul.",
      icon: BookOpen,
      gradient: "from-green-500 to-lime-400",
      shadowColor: "shadow-green-500/30",
      iconColor: "text-green-50",
      bgIcon: "bg-white/20",
      path: "/read"
    },
    {
      id: "quiz",
      title: "Kuiz",
      description: "Uji kefahaman kamu melalui kuiz interaktif.",
      icon: Trophy,
      gradient: "from-rose-500 to-pink-500",
      shadowColor: "shadow-rose-500/30",
      iconColor: "text-rose-50",
      bgIcon: "bg-white/20",
      path: "/quiz"
    },
    {
      id: "ai",
      title: "AI Pembimbing",
      description: "Muallim Khairil membantu kamu memahami perkataan dan bacaan Arab dalam E-Kalam.",
      icon: Bot,
      gradient: "from-purple-600 to-violet-500",
      shadowColor: "shadow-purple-500/30",
      iconColor: "text-purple-50",
      bgIcon: "bg-white/20",
      path: "/ai",
      avatar: muallimKhairilAvatar
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-safe relative">
      {/* Hero / Header Section */}
      <div className="flex flex-col items-center justify-center px-6 mt-6 mb-6 text-center relative z-10">
        
        {/* Floating Sparkles (decorative) */}
        <div className="absolute top-0 right-10 text-yellow-400 opacity-70 animate-pulse text-lg">✦</div>
        <div className="absolute top-10 left-8 text-cyan-400 opacity-60 animate-pulse text-sm">✦</div>
        <div className="absolute bottom-5 right-20 text-purple-400 opacity-50 animate-pulse text-xl">✦</div>

        {/* App Name & Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-navy tracking-tight flex items-center justify-center gap-1.5 mb-1.5">
            E-Kalam <span className="text-primary font-arabic font-bold pb-1 text-[32px]">| e-كلام</span>
          </h1>
          <div className="flex justify-center gap-2 text-sm font-bold mb-1.5">
            <span className="text-blue-600 drop-shadow-sm">Dengar.</span>
            <span className="text-green-600 drop-shadow-sm">Baca.</span>
            <span className="text-purple-600 drop-shadow-sm">Faham.</span>
          </div>
          <p className="font-arabic text-xl text-slate-600 font-bold mb-4 drop-shadow-sm">
            أستمع، اقرأ، افهم
          </p>
          <div className="flex justify-center">
            <div className="bg-primary text-white px-5 py-2 rounded-full text-[13px] font-bold shadow-lg shadow-blue-500/40 flex items-center gap-2">
              <span className="tracking-wide">Tahun 3</span>
              <span className="w-1 h-1 bg-white/60 rounded-full"></span>
              <span className="font-arabic font-normal text-sm pt-0.5">الصف الثالث</span>
            </div>
          </div>
        </div>

        {/* Muallim Khairil Hero Section */}
        <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-white to-sky-50 rounded-[2rem] shadow-xl border border-white/60 p-6 flex flex-col items-center overflow-hidden">
          {/* Decorative AI pattern background */}
          <div className="absolute inset-0 bg-app-pattern opacity-30"></div>
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-48 h-56 relative mb-4">
              <img 
                src={muallimKhairilAvatar} 
                alt="Muallim Khairil" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            
            <div className="bg-white w-full px-5 py-4 rounded-2xl rounded-tr-sm shadow-md border border-slate-100 relative mb-6">
              <p className="text-slate-700 text-sm font-bold leading-relaxed text-left">
                Assalamualaikum! Saya Muallim Khairil. Jom belajar Bahasa Arab melalui latihan mendengar dan membaca.
              </p>
              {/* Bubble tail */}
              <div className="absolute -top-2 right-12 w-4 h-4 bg-white border-t border-r border-slate-100 transform -rotate-45"></div>
            </div>

            <button 
              onClick={() => handleFeatureClick('/listen')}
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Mula Belajar
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Cards */}
      <div className="px-5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 z-10 relative">
        {featureCards.map((card, index) => (
          <button 
            key={index}
            onClick={() => handleFeatureClick(card.path)}
            className="w-full text-left group h-full"
          >
            <div className={`relative overflow-hidden h-full rounded-3xl bg-gradient-to-r ${card.gradient} shadow-xl ${card.shadowColor} border border-white/20 transition-all duration-300 transform group-hover:scale-[1.02] group-active:scale-[0.98]`}>
              
              {/* Glossy Overlay & Highlights */}
              <div className="absolute inset-0 glossy-overlay pointer-events-none opacity-50"></div>
              <div className="absolute inset-0 inner-highlight rounded-3xl pointer-events-none opacity-50"></div>
              
              <div className="relative p-5 flex items-center gap-4">
                {/* 3D Icon Container */}
                <div className={`w-16 h-16 rounded-[1.25rem] ${card.bgIcon} shadow-inner flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/40 group-hover:rotate-6 transition-transform duration-300`}>
                  <card.icon className={`w-8 h-8 ${card.iconColor} drop-shadow-lg`} strokeWidth={2.5} />
                </div>
                
                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">{card.title}</h3>
                  <p className="text-white/90 text-[11px] font-medium leading-snug drop-shadow-sm pr-2">
                    {card.description}
                  </p>
                  {card.id === 'ai' && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                       Tanya Muallim Khairil <ChevronRight className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Arrow Button or Avatar */}
                {card.avatar ? (
                  <div className="w-16 h-16 relative flex-shrink-0 -mr-2">
                    <img src={card.avatar} alt="Muallim Khairil" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-sm border border-white/30 group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Contents Section */}
      <div className="px-4 mt-2 mb-8 z-10 relative">
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto bg-white/90 rounded-[2rem] p-6 shadow-xl border border-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <img
              src={muallimahUmmiAvatar}
              alt="Muallimah Ummi"
              className="h-44 w-32 object-contain drop-shadow-md"
            />

            <p className="mt-2 text-base font-bold text-purple-700">
              Muallimah Ummi
            </p>

            <div className="mt-3 rounded-2xl bg-purple-50 px-5 py-3 border border-purple-100 relative shadow-sm max-w-sm">
              {/* Bubble tail */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-50 border-t border-l border-purple-100 rotate-45"></div>
              <p className="text-center text-sm text-slate-700 font-bold leading-relaxed">
                Pilih unit pembelajaran dan mulakan latihan kamu.
              </p>
            </div>

            <h2 className="mt-8 text-center font-arabic text-[32px] font-bold text-purple-700 drop-shadow-sm">
              المُحْتَوَيَاتُ
            </h2>

            <p className="mt-1 mb-6 text-center text-[15px] font-bold text-slate-500 tracking-wide">
              Kandungan Pembelajaran
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {contentsUnits.map((item, index) => (
              <button 
                key={item.id} 
                onClick={() => {
                  if (item.id === 1) {
                    navigate('/units/unit-one');
                  } else if (item.id === 2) {
                    navigate('/units/unit-two');
                  } else if (item.id === 3) {
                    navigate('/units/unit-three');
                  } else if (item.id === 4) {
                    navigate('/units/unit-four');
                  } else {
                    alert(item.id === 5 ? item.unit : `${item.unit}: ${item.title}`);
                  }
                }}
                className="group relative outline-none focus:outline-none w-full"
              >
                <div className={`relative w-full aspect-square flex flex-col items-center justify-center p-4 bg-gradient-to-b ${item.gradient} ${item.shadow} shadow-xl border-4 border-white/80 transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 ${item.shape} overflow-hidden`}>
                  <div className="absolute inset-0 glossy-overlay pointer-events-none opacity-40"></div>
                  
                  <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center mb-3 backdrop-blur-sm shadow-inner border border-white/40">
                    <item.icon className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                  
                  <h3 className="text-white font-arabic font-bold text-2xl drop-shadow-md mb-1">{item.unit}</h3>
                  
                  <p className="text-white/95 font-arabic font-bold text-lg leading-tight drop-shadow-sm text-center px-2">
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer / Administrative entry */}
      <footer className="w-full mt-auto py-8 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/50 relative z-10">
        <div className="flex flex-col items-center gap-2">
          <span>&copy; {new Date().getFullYear()} E-Kalam. Hak Cipta Terpelihara.</span>
          <button 
            onClick={() => navigate('/admin/login')}
            className="text-slate-500 hover:text-primary font-semibold underline transition-colors"
          >
            Log Masuk Admin
          </button>
        </div>
      </footer>
      
    </div>
  );
}
