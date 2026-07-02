import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  completedThemes: string[];
  completedListening: string[];
  completedReading: string[];
  listeningScore: number;
  readingScore: number;
  quizScore: number;
  
  markThemeCompleted: (themeId: string) => void;
  markListeningCompleted: (activityId: string) => void;
  markReadingCompleted: (activityId: string) => void;
  addListeningScore: (points: number) => void;
  addReadingScore: (points: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      completedThemes: [],
      completedListening: [],
      completedReading: [],
      listeningScore: 0,
      readingScore: 0,
      quizScore: 0,
      
      markThemeCompleted: (themeId) => set((state) => ({
        completedThemes: state.completedThemes.includes(themeId) 
          ? state.completedThemes 
          : [...state.completedThemes, themeId]
      })),
      markListeningCompleted: (activityId) => set((state) => ({
        completedListening: state.completedListening.includes(activityId) 
          ? state.completedListening 
          : [...state.completedListening, activityId]
      })),
      markReadingCompleted: (activityId) => set((state) => ({
        completedReading: state.completedReading.includes(activityId) 
          ? state.completedReading 
          : [...state.completedReading, activityId]
      })),
      addListeningScore: (points) => set((state) => ({
        listeningScore: state.listeningScore + points
      })),
      addReadingScore: (points) => set((state) => ({
        readingScore: state.readingScore + points
      }))
    }),
    {
      name: 'e-kalam-storage',
    }
  )
);
