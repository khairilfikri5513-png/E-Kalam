import React from "react";
import { Volume2 } from "lucide-react";

interface AudioButtonProps {
  onPress: (e: React.MouseEvent) => void;
  className?: string;
  iconClassName?: string;
  themeColor?: "blue" | "pink";
}

export function AudioButton({
  onPress,
  className = "",
  iconClassName = "",
  themeColor = "blue",
}: AudioButtonProps) {
  const bgClass =
    themeColor === "pink"
      ? "bg-pink-100 text-pink-600 group-hover:bg-pink-600"
      : "bg-sky-50 text-sky-500 group-hover:bg-sky-500";

  return (
    <button
      onClick={onPress}
      className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:text-white transition-colors shadow-sm ${bgClass} ${className}`}
    >
      <Volume2 className={`w-6 h-6 ${iconClassName}`} />
    </button>
  );
}
