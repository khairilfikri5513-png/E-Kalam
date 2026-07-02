import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { themes, vocabularyData } from '../data/mockData';
import { VocabularyCard } from '../components/ui/Components';
import { ArrowLeft, Headphones, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ThemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = themes.find(t => t.id === id);
  const vocabList = vocabularyData.filter(v => v.themeId === id);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!theme) return <div className="p-6">Tema tidak dijumpai.</div>;

  const handleNext = () => {
    if (currentIndex < vocabList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-6 py-4 flex items-center gap-4 sticky top-0 z-10 backdrop-blur-sm bg-white/70 border-b border-sky-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-navy" />
        </button>
        <h1 className="text-xl font-bold text-navy flex-1">{theme.title}</h1>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center">
        {vocabList.length > 0 ? (
          <div className="w-full flex-1 flex flex-col justify-center max-w-sm mx-auto">
            <div className="text-center mb-6 text-[13px] font-bold text-slate-400 tracking-widest uppercase">
              Kosa Kata {currentIndex + 1} / {vocabList.length}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 20, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <VocabularyCard 
                  arabic={vocabList[currentIndex].arabicText} 
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 py-4 rounded-[20px] font-bold text-slate-500 bg-white border-2 border-sky disabled:opacity-50 active:bg-slate-50"
              >
                Sebelumnya
              </button>
              <button 
                onClick={handleNext}
                disabled={currentIndex === vocabList.length - 1}
                className="flex-1 py-4 rounded-[20px] font-bold text-white bg-primary disabled:opacity-50 shadow-md shadow-primary/20 active:translate-y-0.5"
              >
                Seterusnya
              </button>
            </div>
            
            <div className="mt-12 space-y-3">
              <button onClick={() => navigate('/listen')} className="w-full bg-cyan/10 p-5 rounded-[20px] border border-cyan/20 shadow-sm flex items-center justify-center gap-3 active:scale-95 text-cyan font-bold transition-transform">
                <Headphones className="w-5 h-5" />
                Mula Latihan Mendengar
              </button>
              <button onClick={() => navigate('/read')} className="w-full bg-purple/10 p-5 rounded-[20px] border border-purple/20 shadow-sm flex items-center justify-center gap-3 active:scale-95 text-purple font-bold transition-transform">
                <BookOpen className="w-5 h-5" />
                Mula Latihan Membaca
              </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 font-medium text-center mt-20 bg-white p-6 rounded-3xl border border-sky">
            Tiada kosa kata untuk tema ini.
          </div>
        )}
      </div>
    </div>
  );
}
