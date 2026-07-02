import React from 'react';
import { useNavigate } from 'react-router-dom';
import { themes } from '../data/mockData';
import { ThemeCard } from '../components/ui/Components';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export default function Themes() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-transparent px-6 py-8 pb-4 sticky top-0 z-10 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-navy">Tema Pembelajaran</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Pilih tema untuk mula belajar</p>
      </div>
      
      <div className="px-6 py-4 flex flex-col gap-4">
        {themes.map((theme, idx) => {
          const Icon = (Icons as any)[theme.icon] || Icons.BookOpen;
          
          return (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: idx * 0.05 }}
              key={theme.id}
            >
              <ThemeCard 
                title={theme.title}
                description={theme.description}
                color={theme.color}
                icon={Icon}
                onClick={() => navigate(`/themes/${theme.id}`)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
