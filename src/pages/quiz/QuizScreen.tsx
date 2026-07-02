import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions, playArabicAudio } from '../../data/mockData';
import { Volume2, ChevronRight } from 'lucide-react';
import { getPlaceholderIcon } from '../../utils/iconUtils';

export default function QuizScreen() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const question = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectAnswer = (option: any) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isAnsCorrect = typeof option === 'string' 
      ? option === question.correctAnswer 
      : option.imageKey === question.correctAnswer || option.colorHex === question.correctAnswer;
      
    setIsCorrect(isAnsCorrect);
    setShowFeedback(true);
    
    if (isAnsCorrect) {
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    if (isLastQuestion) {
      const finalScore = correctAnswers * 10;
      navigate('/quiz-result', { 
        state: { score: finalScore, correctAnswers, totalQuestions } 
      });
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  const playQuestionAudio = () => {
    if (question.quizType === 'listening') {
      playArabicAudio(question.correctAnswer);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 sticky top-0 z-10 bg-white shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">
          {question.quizType === 'listening' ? 'Kuiz Mendengar' : 'Kuiz Membaca'}
        </h1>
        <div className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Soalan {currentQuestionIndex + 1} / {totalQuestions}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">
        {/* Question Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 w-full mb-8 flex flex-col items-center relative overflow-hidden">
          <p className="text-center text-slate-600 font-medium mb-6">{question.questionText}</p>
          
          {question.quizType === 'listening' ? (
            <button 
              onClick={playQuestionAudio}
              className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 hover:scale-105 active:scale-95 transition-all shadow-inner"
            >
              <Volume2 className="w-10 h-10 text-blue-600" />
            </button>
          ) : (
            <div className="font-arabic text-6xl text-navy my-4" dir="rtl">
              {question.arabicText}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="w-full grid grid-cols-2 gap-4">
          {question.options.map((option: any, idx) => {
            const isOptionSelected = selectedAnswer === option;
            const isOptionCorrect = typeof option === 'string' 
              ? option === question.correctAnswer 
              : option.imageKey === question.correctAnswer || option.colorHex === question.correctAnswer;
            
            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300";
            
            if (isAnswered) {
              if (isOptionCorrect) {
                btnClass = "bg-green-50 border-2 border-green-500 text-green-700";
              } else if (isOptionSelected && !isOptionCorrect) {
                btnClass = "bg-red-50 border-2 border-red-500 text-red-700 opacity-70";
              } else {
                btnClass = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={`p-6 rounded-[24px] transition-all flex items-center justify-center min-h-[120px] ${btnClass} ${
                  !isAnswered ? 'hover:-translate-y-1 hover:shadow-md active:scale-95' : ''
                }`}
                dir={typeof option === 'string' ? "rtl" : "ltr"}
              >
                {typeof option === 'string' ? (
                  <span className="font-arabic text-4xl">{option}</span>
                ) : option.colorHex ? (
                  <div 
                    className="w-16 h-16 rounded-full shadow-inner border-4 border-white"
                    style={{ backgroundColor: option.colorHex }}
                  />
                ) : (
                  <span className="text-6xl">{getPlaceholderIcon(option.imageKey)}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Next Button Footer */}
      <div className={`p-6 bg-white border-t rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors ${showFeedback ? (isCorrect ? 'border-green-100' : 'border-red-100') : 'border-slate-100'}`}>
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {showFeedback && (
            <h3 className={`text-xl font-bold mb-4 text-center ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
              {isCorrect ? 'Hebat! Jawapan kamu betul.' : 'Cuba lagi. Perhatikan soalan dengan teliti.'}
            </h3>
          )}
          
          <button 
            disabled={!isAnswered}
            onClick={handleNext}
            className={`w-full max-w-sm py-4 rounded-[24px] font-bold text-slate-900 shadow-sm transition-all flex items-center justify-center gap-2 text-lg ${
              isAnswered ? 'bg-yellow-400 hover:bg-yellow-500 active:scale-95' : 'bg-slate-200 opacity-70 cursor-not-allowed text-slate-500'
            }`}
          >
            {isAnswered 
              ? (currentQuestionIndex === totalQuestions - 1 ? "Lihat Keputusan" : "Soalan Seterusnya")
              : "Pilih jawapan dahulu"}
            {isAnswered && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
