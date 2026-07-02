import React from "react";
import { UnitVocabulary } from "../../hooks/useUnitVocabulary";
import { getPlaceholderIcon } from "../../utils/iconUtils";

interface TimeVocabularyCardProps {
  item: UnitVocabulary;
  openVocabularyDetail: (item: UnitVocabulary) => void;
  playAudio: (item: UnitVocabulary) => void;
}

export const TimeVocabularyCard: React.FC<TimeVocabularyCardProps> = ({
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
      <div className="h-28 w-full flex items-center justify-center rounded-2xl bg-yellow-50">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.arabic}
            className="h-24 w-24 object-contain"
          />
        ) : (
          <span className="text-5xl">
            {getPlaceholderIcon(item.imageKey)}
          </span>
        )}
      </div>

      <div className="mt-3 text-center text-3xl font-bold text-orange-700 font-arabic" dir="rtl">
        {item.arabic}
      </div>

      <button
        className="mt-3 mx-auto flex items-center justify-center rounded-full bg-yellow-100 p-3 hover:bg-yellow-200 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          playAudio(item);
        }}
      >
        <span className="text-orange-700 text-xl" role="img" aria-label="dengar">
          🔊
        </span>
      </button>
    </div>
  );
};
