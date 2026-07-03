import React from "react";
import { Info } from "lucide-react";
import { MediaAvatar } from "../MediaAvatar";

interface UnitGuideBubbleProps {
  avatarUrl?: string; // Made optional and unused
  message: string;
  themeColor?: "blue" | "pink";
}

export function UnitGuideBubble({
  avatarUrl,
  message,
  themeColor = "blue",
}: UnitGuideBubbleProps) {
  const containerShadow =
    themeColor === "pink" ? "shadow-pink-500/10" : "shadow-blue-500/10";
  const bubbleBg =
    themeColor === "pink"
      ? "bg-pink-50 border-pink-100 text-pink-800"
      : "bg-purple-50 border-purple-100 text-purple-800";

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm ${containerShadow} border border-slate-200 flex items-center gap-3 mb-8`}
    >
      {avatarUrl ? (
        <div className="w-16 h-16 shrink-0 relative">
          <MediaAvatar src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
        </div>
      ) : (
        <div className={`p-2 rounded-full ${bubbleBg}`}>
          <Info className="w-5 h-5" />
        </div>
      )}
      <p className="text-slate-700 text-sm font-bold leading-relaxed flex-1">
        {message}
      </p>
    </div>
  );
}
