import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

function calculateStars(score: number) {
  if (score >= 90) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  if (score > 0) return 1;
  return 0;
}

function getMotivationMessage(stars: number) {
  if (stars === 5) return "Cemerlang! Kamu sangat hebat.";
  if (stars === 4) return "Tahniah! Kamu hampir sempurna.";
  if (stars === 3) return "Bagus! Teruskan latihan.";
  if (stars === 2) return "Usaha yang baik. Cuba lagi.";
  if (stars === 1) return "Jangan putus asa. Mari ulang kaji.";
  return "Mari cuba semula dan kumpul bintang.";
}

function getAchievementBadge(stars: number) {
  if (stars === 5) return "Jaguh E-Kalam";
  if (stars === 4) return "Pembaca Hebat";
  if (stars === 3) return "Pendengar Bijak";
  if (stars === 2) return "Usaha Baik";
  if (stars === 1) return "Mula Berani";
  return "Cuba Lagi";
}

export default function QuizResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const { score = 0, correctAnswers = 0, totalQuestions = 0 } = location.state || {};
  
  const stars = calculateStars(score);
  const message = getMotivationMessage(stars);
  const badge = getAchievementBadge(stars);

  useEffect(() => {
    async function saveResult() {
      setIsSaving(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        
        if (user) {
          const { error } = await supabase.from('quiz_attempts').insert({
            user_id: user.id,
            quiz_type: 'mixed', // or specific if passed
            score,
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            stars,
            badge
          });
          
          if (error) {
            console.warn("Gagal simpan keputusan kuiz:", error);
          }
        }
      } catch (err) {
        console.warn("Error saving quiz attempt", err);
      } finally {
        setIsSaving(false);
      }
    }
    
    if (totalQuestions > 0) {
      saveResult();
    }
  }, [score, totalQuestions, correctAnswers, stars, badge]);

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <button onClick={() => navigate('/quiz')} className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold">
          Ke Muka Utama Kuiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-blue-50/50 pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 max-w-md mx-auto w-full">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-yellow-300 rounded-full blur-3xl opacity-50"></div>
          <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white relative z-10">
             <Trophy className="w-20 h-20 text-white drop-shadow-md" />
          </div>
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-yellow-400 z-20"
          >
            <span className="font-bold text-amber-600">{badge}</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-navy mb-2">Skor: {score}</h1>
          <p className="text-lg text-slate-500 font-medium">Betul {correctAnswers} daripada {totalQuestions}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 mb-8"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
              key={star}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + (star * 0.1), type: "spring" }}
            >
              <Star 
                className={`w-12 h-12 ${
                  star <= stars 
                    ? "fill-yellow-400 text-yellow-500 drop-shadow-md" 
                    : "fill-slate-200 text-slate-300"
                }`} 
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xl font-bold text-blue-600 text-center mb-12"
        >
          {message}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full flex flex-col gap-4"
        >
          <button 
            onClick={() => navigate('/quiz-play')}
            className="w-full py-4 rounded-full font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Cuba Lagi
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-full font-bold text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Home className="w-5 h-5" />
            Kembali ke Utama
          </button>
        </motion.div>
      </div>
    </div>
  );
}
