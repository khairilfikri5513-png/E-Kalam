import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UnitHeaderProps {
  unitLabel: string;
  titleArabic: string;
  titleMalay: string;
  themeColor?: "blue" | "pink";
}

export function UnitHeader({
  unitLabel,
  titleArabic,
  titleMalay,
  themeColor = "blue",
}: UnitHeaderProps) {
  const navigate = useNavigate();

  const bgGradient =
    themeColor === "pink"
      ? "from-pink-400 to-rose-500"
      : "from-sky-400 to-blue-500";
  const fillClass = themeColor === "pink" ? "fill-rose-500" : "fill-blue-500";

  return (
    <div
      className={`bg-gradient-to-b ${bgGradient} pt-safe relative shadow-md`}
    >
      <div className="absolute inset-0 glossy-overlay pointer-events-none opacity-40"></div>
      <div className="px-4 py-4 flex items-center relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-white font-arabic font-bold text-2xl drop-shadow-md">
            {unitLabel}
          </h1>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="pb-6 px-6 text-center relative z-10">
        <h2 className="text-white font-arabic font-bold text-[32px] drop-shadow-lg leading-tight mb-1">
          {titleArabic}
        </h2>
        <p className="text-white/95 font-bold text-lg drop-shadow-sm tracking-wide">
          {titleMalay}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform translate-y-[99%]">
        <svg
          className="relative block w-full h-8"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={fillClass}
          ></path>
        </svg>
      </div>
    </div>
  );
}
