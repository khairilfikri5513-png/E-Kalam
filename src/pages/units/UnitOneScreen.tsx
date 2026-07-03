import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUnitVocabulary,
  UnitVocabulary,
} from "../../hooks/useUnitVocabulary";
import { useUnitVideo } from "../../hooks/useUnitVideo";
import { PlayCircle, BookOpen } from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";
import { VideoWithAudioCheck } from "../../components/VideoWithAudioCheck";
import { UnitHeader } from "../../components/units/UnitHeader";
import { UnitGuideBubble } from "../../components/units/UnitGuideBubble";
import { VocabularyCard } from "../../components/units/VocabularyCard";
import { VocabularySkeletonGrid } from "../../components/units/VocabularySkeletonGrid";
import { VocabularyDetailModal } from "../../components/units/VocabularyDetailModal";

export default function UnitOneScreen() {
  const navigate = useNavigate();
  const { vocabulary, loading } = useUnitVocabulary("unit_1_classroom");
  const { videoUrl, loading: videoLoading, error: videoError } = useUnitVideo("unit_1_video");

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
        unitLabel="الوحدة الأولى"
        titleArabic="تفضل إلى الفصل"
        titleMalay="Di Dalam Kelas"
      />

      <div className="flex-1 px-4 pt-12 pb-8 z-10 max-w-4xl mx-auto w-full">
        <UnitGuideBubble
          message="Dengar dan baca perkataan di dalam kelas."
        />

                {/* Unit Video Section */}
        <div className="mb-8">
          {videoLoading ? (
            <Skeleton className="w-full aspect-video rounded-2xl shadow-md" />
          ) : videoError ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-sm border border-red-100">
              {videoError}
            </div>
          ) : videoUrl ? (
            <div className="w-full max-w-3xl mx-auto">
              <VideoWithAudioCheck 
                src={videoUrl} 
                controls 
                playsInline 
                preload="metadata" 
                className="w-full max-h-[45vh] object-contain rounded-xl bg-black shadow-lg" 
              />
            </div>
          ) : (
            <div className="bg-slate-100 text-slate-500 p-8 rounded-2xl text-center text-sm border border-slate-200">
              Tiada video tersedia untuk unit ini.
            </div>
          )}
        </div>

        {/* Vocabulary Grid */}
        {loading ? (
          <VocabularySkeletonGrid />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {vocabulary.map((item) => (
              <VocabularyCard
                key={item.id}
                item={item}
                onPress={openVocabularyDetail}
                onPlayAudio={playAudio}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => navigate("/listen")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <PlayCircle className="w-6 h-6" />
            <span className="text-lg">Mula Latihan Mendengar</span>
          </button>
          <button
            onClick={() => navigate("/read")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
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
      />
    </div>
  );
}
