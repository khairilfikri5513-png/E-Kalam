import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import DeskImage from "../assets/images/classroom_desk_1782833031984.jpg";
import ShirtImage from "../assets/images/shirt_1782909711874.jpg";
import TieImage from "../assets/images/necktie_only_1782909821579.jpg";
import HandkerchiefImage from "../assets/images/handkerchief_1_1782909925955.jpg";
import BeltImage from "../assets/images/belt_only_1782910096405.jpg";

export interface UnitVocabulary {
  id: string | number;
  arabic: string;
  meaning: string;
  category: string;
  audioUrl: string | null;
  imageKey?: string;
  imageUrl?: string | null;
  colorHex?: string;
}

const dummyUnitOneVocabulary: UnitVocabulary[] = [
  {
    id: 1,
    arabic: "كُرْسِيّ",
    meaning: "Kerusi",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "chair",
    imageUrl: null,
  },
  {
    id: 2,
    arabic: "بَاب",
    meaning: "Pintu",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "door",
    imageUrl: null,
  },
  {
    id: 3,
    arabic: "مَكْتَب",
    meaning: "Meja",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "desk",
    imageUrl: DeskImage,
  },
  {
    id: 4,
    arabic: "دُولَاب",
    meaning: "Almari",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "cupboard",
    imageUrl: null,
  },
  {
    id: 5,
    arabic: "مِصْبَاح",
    meaning: "Lampu",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "lamp",
    imageUrl: null,
  },
  {
    id: 6,
    arabic: "نَافِذَة",
    meaning: "Tingkap",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "window",
    imageUrl: null,
  },
  {
    id: 7,
    arabic: "لَوْحَة",
    meaning: "Papan / papan paparan",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "board",
    imageUrl: null,
  },
  {
    id: 8,
    arabic: "مِرْوَحَة",
    meaning: "Kipas",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "fan",
    imageUrl: null,
  },
  {
    id: 9,
    arabic: "مُمْسَحَة",
    meaning: "Pemadam papan",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "eraser",
    imageUrl: null,
  },
  {
    id: 10,
    arabic: "سَبُّورَة",
    meaning: "Papan tulis",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "whiteboard",
    imageUrl: null,
  },
  {
    id: 11,
    arabic: "مِكْنَسَة",
    meaning: "Penyapu",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "broom",
    imageUrl: null,
  },
  {
    id: 12,
    arabic: "سَلَّة",
    meaning: "Bakul / tong sampah",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "basket",
    imageUrl: null,
  },
  {
    id: 13,
    arabic: "كِتَاب",
    meaning: "Buku",
    category: "Di Dalam Kelas",
    audioUrl: null,
    imageKey: "book",
    imageUrl: null,
  },
];

const dummyUnitTwoVocabulary: UnitVocabulary[] = [
  {
    id: 1,
    arabic: "نَظَّارَةٌ",
    meaning: "Cermin mata",
    category: "Pakaian",
    imageKey: "glasses",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 2,
    arabic: "قَمِيصٌ",
    meaning: "Kemeja / baju",
    category: "Pakaian",
    imageKey: "shirt",
    imageUrl: ShirtImage,
    audioUrl: null,
  },
  {
    id: 3,
    arabic: "بَنْطَلُونٌ",
    meaning: "Seluar panjang",
    category: "Pakaian",
    imageKey: "pants",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 4,
    arabic: "رَبْطَةُ العُنُقِ",
    meaning: "Tali leher",
    category: "Pakaian",
    imageKey: "tie",
    imageUrl: TieImage,
    audioUrl: null,
  },
  {
    id: 5,
    arabic: "حِزَامٌ",
    meaning: "Tali pinggang",
    category: "Pakaian",
    imageKey: "belt",
    imageUrl: BeltImage,
    audioUrl: null,
  },
  {
    id: 6,
    arabic: "فُسْتَانٌ",
    meaning: "Gaun",
    category: "Pakaian",
    imageKey: "dress",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 7,
    arabic: "خِمَارٌ",
    meaning: "Tudung",
    category: "Pakaian",
    imageKey: "hijab",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 8,
    arabic: "مَنْدِيلٌ",
    meaning: "Sapu tangan",
    category: "Pakaian",
    imageKey: "handkerchief",
    imageUrl: HandkerchiefImage,
    audioUrl: null,
  },
  {
    id: 9,
    arabic: "مِحْفَظَةٌ",
    meaning: "Dompet",
    category: "Pakaian",
    imageKey: "wallet",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 10,
    arabic: "جَوْرَبٌ",
    meaning: "Stoking",
    category: "Pakaian",
    imageKey: "socks",
    imageUrl: null,
    audioUrl: null,
  },
  {
    id: 11,
    arabic: "حِذَاءٌ",
    meaning: "Kasut",
    category: "Pakaian",
    imageKey: "shoes",
    imageUrl: null,
    audioUrl: null,
  },
];

const dummyUnitThreeVocabulary: UnitVocabulary[] = [
  {
    id: 1,
    arabic: "أَحْمَرُ",
    meaning: "Merah",
    category: "Warna",
    imageKey: "red",
    colorHex: "#EF4444",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 2,
    arabic: "أَزْرَقُ",
    meaning: "Biru",
    category: "Warna",
    imageKey: "blue",
    colorHex: "#2563EB",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 3,
    arabic: "أَبْيَضُ",
    meaning: "Putih",
    category: "Warna",
    imageKey: "white",
    colorHex: "#FFFFFF",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 4,
    arabic: "أَخْضَرُ",
    meaning: "Hijau",
    category: "Warna",
    imageKey: "green",
    colorHex: "#22C55E",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 5,
    arabic: "أَسْوَدُ",
    meaning: "Hitam",
    category: "Warna",
    imageKey: "black",
    colorHex: "#111827",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 6,
    arabic: "أَصْفَرُ",
    meaning: "Kuning",
    category: "Warna",
    imageKey: "yellow",
    colorHex: "#FACC15",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 7,
    arabic: "بُرْتُقَالِيٌّ",
    meaning: "Oren",
    category: "Warna",
    imageKey: "orange",
    colorHex: "#F97316",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 8,
    arabic: "رَمَادِيٌّ",
    meaning: "Kelabu",
    category: "Warna",
    imageKey: "gray",
    colorHex: "#9CA3AF",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 9,
    arabic: "وَرْدِيٌّ",
    meaning: "Merah jambu",
    category: "Warna",
    imageKey: "pink",
    colorHex: "#F472B6",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 10,
    arabic: "بُنِّيٌّ",
    meaning: "Coklat",
    category: "Warna",
    imageKey: "brown",
    colorHex: "#92400E",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 11,
    arabic: "بَنَفْسَجِيٌّ",
    meaning: "Ungu",
    category: "Warna",
    imageKey: "purple",
    colorHex: "#8B5CF6",
    imageUrl: null,
    audioUrl: null
  }
];

const dummyUnitFourVocabulary: UnitVocabulary[] = [
  {
    id: 1,
    arabic: "الْيَوْمَ",
    meaning: "Hari ini",
    category: "Masa dan Hari",
    imageKey: "today",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 2,
    arabic: "غَدًا",
    meaning: "Esok",
    category: "Masa dan Hari",
    imageKey: "tomorrow",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 3,
    arabic: "أَمْسِ",
    meaning: "Semalam",
    category: "Masa dan Hari",
    imageKey: "yesterday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 4,
    arabic: "صَبَاحٌ",
    meaning: "Pagi",
    category: "Masa dan Hari",
    imageKey: "morning",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 5,
    arabic: "ظُهْرٌ",
    meaning: "Tengah hari",
    category: "Masa dan Hari",
    imageKey: "noon",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 6,
    arabic: "مَسَاءٌ",
    meaning: "Petang / malam",
    category: "Masa dan Hari",
    imageKey: "evening",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 7,
    arabic: "الْإِثْنَيْنِ",
    meaning: "Isnin",
    category: "Masa dan Hari",
    imageKey: "monday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 8,
    arabic: "الثُّلَاثَاءِ",
    meaning: "Selasa",
    category: "Masa dan Hari",
    imageKey: "tuesday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 9,
    arabic: "الْأَرْبِعَاءِ",
    meaning: "Rabu",
    category: "Masa dan Hari",
    imageKey: "wednesday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 10,
    arabic: "الْخَمِيسِ",
    meaning: "Khamis",
    category: "Masa dan Hari",
    imageKey: "thursday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 11,
    arabic: "الْجُمُعَةِ",
    meaning: "Jumaat",
    category: "Masa dan Hari",
    imageKey: "friday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 12,
    arabic: "السَّبْتِ",
    meaning: "Sabtu",
    category: "Masa dan Hari",
    imageKey: "saturday",
    imageUrl: null,
    audioUrl: null
  },
  {
    id: 13,
    arabic: "الْأَحَدِ",
    meaning: "Ahad",
    category: "Masa dan Hari",
    imageKey: "sunday",
    imageUrl: null,
    audioUrl: null
  }
];

const vocabCache: Record<string, UnitVocabulary[]> = {};

export function useUnitVocabulary(unitKey: string) {
  const [vocabulary, setVocabulary] = useState<UnitVocabulary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVocab() {
      if (vocabCache[unitKey]) {
        setVocabulary(vocabCache[unitKey]);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("unit_vocabulary")
          .select("*")
          .eq("unit_key", unitKey)
          .order("order_index", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedData = data.map((item) => ({
            id: item.id,
            arabic: item.arabic_text,
            meaning: item.meaning_ms || "",
            category: item.category || "",
            audioUrl: item.audio_url,
            imageKey: item.image_key,
            imageUrl: item.image_url,
            colorHex: item.color_hex,
          }));
          vocabCache[unitKey] = mappedData;
          setVocabulary(mappedData);
        } else {
          // Fallback to dummy data based on unitKey
          if (unitKey === "unit_1_classroom") {
            setVocabulary(dummyUnitOneVocabulary);
          } else if (unitKey === "unit_2_clothing") {
            setVocabulary(dummyUnitTwoVocabulary);
          } else if (unitKey === "unit_3_colors") {
            setVocabulary(dummyUnitThreeVocabulary);
          } else if (unitKey === "unit_4_time") {
            setVocabulary(dummyUnitFourVocabulary);
          } else {
            setVocabulary([]);
          }
        }
      } catch (err) {
        console.warn("Info fetching unit vocabulary:", err);
        // Fallback to dummy data
        if (unitKey === "unit_1_classroom") {
          setVocabulary(dummyUnitOneVocabulary);
        } else if (unitKey === "unit_2_clothing") {
          setVocabulary(dummyUnitTwoVocabulary);
        } else if (unitKey === "unit_3_colors") {
          setVocabulary(dummyUnitThreeVocabulary);
        } else if (unitKey === "unit_4_time") {
          setVocabulary(dummyUnitFourVocabulary);
        }
      } finally {
        setLoading(false);
      }
    }

    if (
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== "https://placeholder.supabase.co"
    ) {
      fetchVocab();
    } else {
      // Direct fallback if no supabase configured
      if (unitKey === "unit_1_classroom") {
        setVocabulary(dummyUnitOneVocabulary);
      } else if (unitKey === "unit_2_clothing") {
        setVocabulary(dummyUnitTwoVocabulary);
      } else if (unitKey === "unit_3_colors") {
        setVocabulary(dummyUnitThreeVocabulary);
      } else if (unitKey === "unit_4_time") {
        setVocabulary(dummyUnitFourVocabulary);
      } else {
        setVocabulary([]);
      }
      setLoading(false);
    }
  }, [unitKey]);

  return { vocabulary, loading };
}
