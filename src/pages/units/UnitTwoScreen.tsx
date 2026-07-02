import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUnitVocabulary,
  UnitVocabulary,
} from "../../hooks/useUnitVocabulary";
import { useAppAssets } from "../../hooks/useAppAssets";
import MuallimahUmmiAvatarLocal from "../../assets/images/muallimah-ummi-avatar.png";
import { PlayCircle, BookOpen } from "lucide-react";
import { UnitHeader } from "../../components/units/UnitHeader";
import { UnitGuideBubble } from "../../components/units/UnitGuideBubble";
import { VocabularyCard } from "../../components/units/VocabularyCard";
import { VocabularyDetailModal } from "../../components/units/VocabularyDetailModal";

export default function UnitTwoScreen() {
  const navigate = useNavigate();
  const { vocabulary, loading } = useUnitVocabulary("unit_2_clothing");
  const { assets } = useAppAssets(["muallimah_ummi_avatar"]);
  const muallimahUmmiAvatar =
    assets.muallimah_ummi_avatar || MuallimahUmmiAvatarLocal;

  const [selectedWord, setSelectedWord] = useState<UnitVocabulary | null>(null);

  const playAudio = (e: React.MouseEvent, item: UnitVocabulary) => {
    e.stopPropagation();
    if (item.audioUrl) {
      alert("Memainkan audio: " + item.arabic);
    } else {
      alert("Audio akan dimasukkan oleh admin.");
    }
  };

  const openVocabularyDetail = (item: UnitVocabulary) => {
    setSelectedWord(item);
  };

  const closeVocabularyDetail = () => {
    setSelectedWord(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden flex flex-col">
      {/* Background AI Pattern */}
      <div className="absolute inset-0 bg-app-pattern opacity-[0.03] pointer-events-none"></div>

      <UnitHeader
        unitLabel="الوحدة الثانية"
        titleArabic="ملابسي الجميلة"
        titleMalay="Pakaian saya cantik"
        themeColor="pink"
      />

      <div className="flex-1 px-4 pt-12 pb-8 z-10 max-w-4xl mx-auto w-full">
        <UnitGuideBubble
          avatarUrl={muallimahUmmiAvatar}
          message="Dengar dan sebut perkataan di bawah"
          themeColor="pink"
        />

        {/* Vocabulary Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {vocabulary.map((item) => (
              <VocabularyCard
                key={item.id}
                item={item}
                onPress={openVocabularyDetail}
                onPlayAudio={playAudio}
                themeColor="pink"
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => navigate("/listen")}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-pink-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <PlayCircle className="w-6 h-6" />
            <span className="text-lg">Mula Latihan Mendengar</span>
          </button>
          <button
            onClick={() => navigate("/read")}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-lg">Mula Latihan Membaca</span>
          </button>
        </div>
      </div>

      <VocabularyDetailModal
        item={selectedWord}
        onClose={closeVocabularyDetail}
        onPlayAudio={playAudio}
        themeColor="pink"
      />
    </div>
  );
}
