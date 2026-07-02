import React from "react";

interface UnitGuideBubbleProps {
  avatarUrl: string;
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
      ? "bg-pink-50 border-pink-100"
      : "bg-purple-50 border-purple-100";

  return (
    <div
      className={`bg-white rounded-3xl p-4 shadow-lg ${containerShadow} border border-slate-100 flex items-center gap-4 mb-8 relative`}
    >
      <div className="w-20 h-28 flex-shrink-0 relative -mt-6">
        <img
          src={avatarUrl}
          alt="Guide Avatar"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
      <div
        className={`flex-1 rounded-2xl rounded-tl-sm p-4 relative border ${bubbleBg}`}
      >
        <p className="text-slate-700 text-sm font-bold leading-relaxed">
          {message}
        </p>
        <div
          className={`absolute -left-2 top-4 w-4 h-4 border-b border-l transform rotate-45 ${bubbleBg}`}
        ></div>
      </div>
    </div>
  );
}
