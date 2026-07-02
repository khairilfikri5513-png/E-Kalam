import React from "react";
import { UnitVocabulary } from "../../hooks/useUnitVocabulary";
import { AudioButton } from "./AudioButton";
import { getPlaceholderIcon } from "../../utils/iconUtils";

interface VocabularyCardProps {
  item: UnitVocabulary;
  onPress: (item: UnitVocabulary) => void;
  onPlayAudio: (e: React.MouseEvent, item: UnitVocabulary) => void;
  themeColor?: "blue" | "pink";
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  onPress,
  onPlayAudio,
  themeColor = "blue",
}) => {
  const bgClass =
    themeColor === "pink"
      ? "bg-pink-50 border-pink-100/50"
      : "bg-blue-50 border-blue-100/50";
  const textClass =
    themeColor === "pink"
      ? "text-pink-700 group-hover:text-pink-600"
      : "text-blue-700 group-hover:text-blue-600";

  return (
    <div
      onClick={() => onPress(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress(item);
        }
      }}
      className="bg-white rounded-[2rem] p-4 shadow-md shadow-slate-200/50 border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform group text-center h-full cursor-pointer w-full"
    >
      <div
        className={`h-24 w-full items-center justify-center rounded-2xl flex mb-3 border ${bgClass}`}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.arabic}
            className="h-20 w-20 object-contain drop-shadow-sm mix-blend-multiply"
          />
        ) : (
          <span className="text-5xl">{getPlaceholderIcon(item.imageKey)}</span>
        )}
      </div>

      <span
        className={`font-arabic font-bold text-3xl leading-tight transition-colors mb-4 text-center w-full ${textClass}`}
      >
        {item.arabic}
      </span>

      <div className="mt-auto">
        <AudioButton
          onPress={(e) => onPlayAudio(e, item)}
          themeColor={themeColor as "blue" | "pink"}
        />
      </div>
    </div>
  );
}
