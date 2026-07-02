import React from 'react';
import { Trophy, Zap, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Quiz() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full relative bg-slate-50">
      <div className="px-6 py-6 sticky top-0 z-10 backdrop-blur-sm bg-white/70 border-b border-sky-100">
        <h1 className="text-2xl font-bold text-navy">Kuiz Interaktif</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Uji kefahaman mendengar dan membaca</p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-2xl"></div>
          <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/30 relative z-10 border-4 border-white">
             <Trophy className="w-20 h-20 text-white drop-shadow-md" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md z-20">
             <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          </div>
        </motion.div>
        
        <div className="bg-white rounded-3xl p-6 shadow-md w-full max-w-sm border border-slate-100 mb-8">
          <h2 className="text-2xl font-bold text-navy mb-3">Cabaran Minda</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Kumpul bintang pencapaian dengan menjawab soalan bergambar dan audio.
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/quiz-play')}
          className="w-full max-w-xs py-4 rounded-[24px] font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_#2563EB] active:shadow-[0_0px_0_#2563EB] active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xl"
        >
          <Play className="w-6 h-6 fill-white" />
          Mula Kuiz
        </button>
      </div>
    </div>
  );
}
