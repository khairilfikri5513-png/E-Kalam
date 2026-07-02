import React from "react";
import { X, Volume2 } from "lucide-react";
import { UnitVocabulary } from "../../hooks/useUnitVocabulary";
import { getPlaceholderIcon } from "../../utils/iconUtils";

interface VocabularyDetailModalProps {
  item: UnitVocabulary | null;
  onClose: () => void;
  onPlayAudio: (e: React.MouseEvent, item: UnitVocabulary) => void;
  themeColor?: "blue" | "pink";
}

export function VocabularyDetailModal({
  item,
  onClose,
  onPlayAudio,
  themeColor = "blue",
}: VocabularyDetailModalProps) {
  if (!item) return null;

  const bgGradient =
    themeColor === "pink"
      ? "from-pink-400 to-rose-500"
      : "from-sky-400 to-blue-500";
  const imgBgClass =
    themeColor === "pink"
      ? "bg-pink-50 border-pink-100/50"
      : "bg-blue-50 border-blue-100/50";
  const textClass = themeColor === "pink" ? "text-pink-600" : "text-blue-600";
  const btnGradient =
    themeColor === "pink"
      ? "from-pink-400 to-rose-600 shadow-rose-500/40"
      : "from-blue-400 to-blue-600 shadow-blue-500/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col items-center border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div
          className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${bgGradient} opacity-20 pointer-events-none rounded-t-[2.5rem]`}
        ></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-16 pb-8 px-8 w-full flex flex-col items-center relative z-10 text-center">
          <div
            className={`h-32 w-32 items-center justify-center rounded-[2rem] flex mb-6 border shadow-inner ${imgBgClass}`}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.arabic}
                className="h-28 w-28 object-contain drop-shadow-md mix-blend-multiply"
              />
            ) : item.colorHex ? (
              <div
                className={`h-28 w-28 rounded-full shadow-md ${
                  item.colorHex.toUpperCase() === "#FFFFFF"
                    ? "border-2 border-slate-300"
                    : "border-4 border-white"
                }`}
                style={{ backgroundColor: item.colorHex }}
              />
            ) : (
              <span className="text-7xl">
                {getPlaceholderIcon(item.imageKey)}
              </span>
            )}
          </div>

          <h3
            className={`font-arabic font-bold text-[56px] leading-tight mb-8 drop-shadow-sm ${textClass}`}
          >
            {item.arabic}
          </h3>

          <button
            onClick={(e) => onPlayAudio(e, item)}
            className={`w-20 h-20 bg-gradient-to-br ${btnGradient} rounded-full flex items-center justify-center shadow-lg text-white hover:scale-105 active:scale-95 transition-all mb-4`}
          >
            <Volume2 className="w-10 h-10 ml-1" />
          </button>
          <p className="text-sm font-bold text-slate-400">Dengar Sebutan</p>
        </div>

        <div className={`h-3 w-full bg-gradient-to-r ${bgGradient}`}></div>
      </div>
    </div>
  );
}
