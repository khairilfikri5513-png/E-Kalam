import React from 'react';
import { cn } from '../../lib/utils';
import { Volume2 } from 'lucide-react';
import { playArabicAudio } from '../../data/mockData';

export function ThemeCard({ title, description, color, icon: Icon, onClick }: { title: string, description: string, color: string, icon: any, onClick: () => void }) {
  // Extract color name (e.g. "blue" from "bg-blue-100 text-blue-600")
  // In the new design, we can use specific inline colors or tailwind classes
  return (
    <button 
      onClick={onClick}
      className="flex items-center p-4 rounded-[24px] w-full text-left transition-transform active:scale-95 shadow-sm border border-sky bg-white hover:bg-slate-50 overflow-hidden relative group"
    >
      <div className={cn("w-14 h-14 rounded-[20px] flex items-center justify-center mr-4 shrink-0 shadow-sm", color)}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="flex-1 z-10">
        <h3 className="font-bold text-navy text-[17px] mb-0.5">{title}</h3>
        <p className="text-xs text-slate-500 font-medium leading-tight">{description}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-sky/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </button>
  );
}

export function VocabularyCard({ arabic, onPlay }: { arabic: string, meaning?: string, onPlay?: () => void }) {
  return (
    <div className="bg-white border-2 border-sky p-8 rounded-[32px] shadow-sm text-center flex flex-col items-center gap-6 relative overflow-hidden w-full">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky/40 to-transparent"></div>
      
      <button 
        onClick={() => {
          playArabicAudio(arabic);
          onPlay?.();
        }}
        className="absolute top-6 right-6 text-white bg-primary p-3 rounded-full hover:bg-blue-600 active:scale-90 transition-transform shadow-md shadow-primary/30 z-10"
      >
        <Volume2 className="w-6 h-6" />
      </button>
      
      <div className="font-arabic text-7xl text-navy my-10 leading-tight relative z-10 px-4" dir="rtl">{arabic}</div>
    </div>
  );
}

export function ActionButton({ children, onClick, variant = 'primary', className }: { children: React.ReactNode, onClick?: () => void, variant?: 'primary'|'secondary'|'outline', className?: string }) {
  const variants = {
    primary: "bg-primary text-white shadow-md shadow-blue-500/20 active:bg-blue-600",
    secondary: "bg-secondary text-white shadow-md shadow-emerald-500/20 active:bg-emerald-600",
    outline: "border-2 border-gray-200 text-gray-600 active:bg-gray-50"
  };
  
  return (
    <button 
      onClick={onClick}
      className={cn(
        "py-3 px-6 rounded-2xl font-semibold text-[15px] transition-all active:scale-95 w-full flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
