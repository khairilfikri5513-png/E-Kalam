import React, { useState, useEffect, useRef } from 'react';
import { activitiesData, playArabicAudio } from '../data/mockData';
import { Volume2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useAppAssets } from '../hooks/useAppAssets';

export default function Listen() {
  const listeningActivities = activitiesData.filter(a => a.skillType === 'listening');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { addListeningScore, markListeningCompleted } = useAppStore();
  const navigate = useNavigate();

  const currentActivity = listeningActivities[currentIndex];

  if (!currentActivity) return <div className="p-6">Tiada latihan mendengar.</div>;

  // Custom audio integration
  const activityKeys = listeningActivities.map(act => `audio_activity_${act.id}`);
  const { assets } = useAppAssets(activityKeys);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    const customUrl = assets[`audio_activity_${currentActivity.id}`];
    if (customUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(true);
      const audio = new Audio(customUrl);
      audioRef.current = audio;
      audio.play().catch(err => {
        console.warn("Audio playback error, falling back to speech synthesis:", err);
        playArabicAudio(currentActivity.arabicText || '');
        setIsPlaying(false);
      });
      audio.onended = () => {
        setIsPlaying(false);
      };
    } else {
      playArabicAudio(currentActivity.arabicText || '');
    }
  };

  // Stop audio when shifting slides
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentIndex]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleSelect = (choice: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    setSelectedAnswer(choice);
    
    const correct = choice === currentActivity.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      addListeningScore(10);
      markListeningCompleted(currentActivity.id);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentIndex < listeningActivities.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-6 py-6 sticky top-0 z-10 backdrop-blur-sm bg-white/70 border-b border-sky-100">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6 text-navy" />
          </button>
          <h1 className="text-xl font-bold text-navy">Latihan Mendengar</h1>
        </div>
        <p className="text-sm text-slate-500 font-medium ml-11">{currentActivity.instruction}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-sky h-2.5 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex) / listeningActivities.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center">
        {/* Big Audio Button */}
        <div className="relative mt-8 mb-12">
           {isPlaying && <div className="absolute inset-0 bg-cyan/25 rounded-full animate-ping scale-110"></div>}
           <button 
             onClick={handlePlayAudio}
             className={`relative w-32 h-32 bg-gradient-to-br from-primary to-cyan text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 active:scale-95 transition-all z-10 ${
               isPlaying ? 'scale-105 shadow-cyan/40 ring-4 ring-cyan/25' : ''
             }`}
           >
             <Volume2 className="w-14 h-14" />
           </button>
        </div>

        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          {currentActivity.choices.map((choice, idx) => {
            let btnClass = "bg-white border-2 border-sky text-navy font-bold text-lg shadow-sm";
            
            if (selectedAnswer === choice) {
              btnClass = isCorrect 
                ? "bg-green/10 border-green text-green shadow-md" 
                : "bg-pink/10 border-pink text-pink shadow-md";
            } else if (selectedAnswer !== null && choice === currentActivity.correctAnswer) {
              btnClass = "bg-green/10 border-green text-green shadow-md";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(choice)}
                disabled={selectedAnswer !== null}
                className={`py-5 px-4 rounded-[24px] transition-all text-center font-arabic text-3xl ${btnClass} ${
                  selectedAnswer === null ? 'hover:-translate-y-1 hover:shadow-md active:scale-95' : ''
                }`}
                dir="rtl"
              >
                {choice}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 w-full max-w-sm"
            >
              <div className={`p-4 rounded-2xl flex items-center gap-3 mb-4 border-2 ${isCorrect ? 'bg-green/10 border-green/30 text-green' : 'bg-pink/10 border-pink/30 text-pink'}`}>
                {isCorrect ? <CheckCircle2 className="w-7 h-7 shrink-0" /> : <XCircle className="w-7 h-7 shrink-0" />}
                <span className="font-bold text-[15px]">
                  {isCorrect ? 'Hebat! Jawapan kamu betul.' : 'Cuba lagi. Dengar audio dengan teliti.'}
                </span>
              </div>
              <button 
                onClick={handleNext}
                className="w-full py-4 rounded-2xl font-bold text-white bg-navy shadow-lg active:bg-slate-800 active:scale-95 transition-all"
              >
                Seterusnya
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
