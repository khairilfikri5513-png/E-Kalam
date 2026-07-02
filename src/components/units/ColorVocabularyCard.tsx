import React from "react";
import { UnitVocabulary } from "../../hooks/useUnitVocabulary";

interface ColorVocabularyCardProps {
  item: UnitVocabulary;
  openVocabularyDetail: (item: UnitVocabulary) => void;
  playAudio: (item: UnitVocabulary) => void;
}

export const ColorVocabularyCard: React.FC<ColorVocabularyCardProps> = ({
  item,
  openVocabularyDetail,
  playAudio,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className="mb-4 w-[48%] rounded-3xl bg-white p-4 shadow-md focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer text-left"
      onClick={() => openVocabularyDetail(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openVocabularyDetail(item);
        }
      }}
    >
      <div className="h-28 w-full flex items-center justify-center rounded-2xl bg-blue-50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.arabic}
            className="h-24 w-24 object-contain mix-blend-multiply drop-shadow-sm"
          />
        ) : (
          <div
            className={`h-24 w-24 rounded-full shadow-md ${
              item.colorHex?.toUpperCase() === "#FFFFFF"
                ? "border-2 border-slate-300"
                : "border-4 border-white"
            }`}
            style={{ backgroundColor: item.colorHex || "#CCCCCC" }}
          />
        )}
      </div>

      <div className="mt-3 text-center text-3xl font-bold text-blue-700 font-arabic" dir="rtl">
        {item.arabic}
      </div>

      <button
        className="mt-3 mx-auto flex items-center justify-center rounded-full bg-blue-100 p-3 hover:bg-blue-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          playAudio(item);
        }}
      >
        <span className="text-blue-700 text-xl" role="img" aria-label="dengar">
          🔊
        </span>
      </button>
    </div>
  );
};
