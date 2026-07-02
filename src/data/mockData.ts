export type SkillType = 'listening' | 'reading';

export interface Theme {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface Vocabulary {
  id: string;
  themeId: string;
  arabicText: string;
  meaningMs: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  themeId: string;
  skillType: SkillType;
  title: string;
  instruction: string;
  arabicText?: string;
  audioUrl?: string;
  questionType: string;
  correctAnswer: string;
  choices: string[];
}

export const themes: Theme[] = [
  { id: 't1', title: 'Huruf Fokus', slug: 'huruf-fokus', description: 'خ، ش، ع، ص، ز، ح، ث، ذ، ظ، غ، ض', icon: 'Type', color: 'bg-primary/10 text-primary' },
  { id: 't2', title: 'Pakaian', slug: 'pakaian', description: 'Mari pelajari kosa kata pakaian.', icon: 'Shirt', color: 'bg-cyan/10 text-cyan' },
  { id: 't3', title: 'Di Dalam Kelas', slug: 'di-dalam-kelas', description: 'Objek-objek di sekeliling kelas.', icon: 'BookOpen', color: 'bg-green/10 text-green' },
  { id: 't4', title: 'Warna', slug: 'warna', description: 'Kenali warna-warna asas.', icon: 'Palette', color: 'bg-purple/10 text-purple' },
  { id: 't5', title: 'Masa dan Hari', slug: 'masa-hari', description: 'Sebutkan hari dan masa.', icon: 'Clock', color: 'bg-pink/10 text-pink' },
  { id: 't6', title: 'Nombor 21-31', slug: 'nombor', description: 'Kira dari ٢١ hingga ٣١.', icon: 'Hash', color: 'bg-yellow/20 text-yellow' },
  { id: 't7', title: 'Ungkapan Harian', slug: 'ungkapan', description: 'Sapaan dan ungkapan biasa.', icon: 'MessageCircle', color: 'bg-primary/10 text-primary' },
];

export const vocabularyData: Vocabulary[] = [
  // Pakaian
  { id: 'v1', themeId: 't2', arabicText: 'قَمِيْص', meaningMs: 'Baju' },
  { id: 'v2', themeId: 't2', arabicText: 'بَنْطَلُوْن', meaningMs: 'Seluar' },
  { id: 'v3', themeId: 't2', arabicText: 'حِذَاء', meaningMs: 'Kasut' },
  { id: 'v4', themeId: 't2', arabicText: 'جَوْرَب', meaningMs: 'Stoking' },
  { id: 'v5', themeId: 't2', arabicText: 'نَظَّارَة', meaningMs: 'Cermin Mata' },
  // Di Dalam Kelas
  { id: 'v6', themeId: 't3', arabicText: 'كُرْسِيّ', meaningMs: 'Kerusi' },
  { id: 'v7', themeId: 't3', arabicText: 'سَبُّوْرَة', meaningMs: 'Papan Putih' },
  { id: 'v8', themeId: 't3', arabicText: 'مَكْتَب', meaningMs: 'Meja' },
  { id: 'v9', themeId: 't3', arabicText: 'بَاب', meaningMs: 'Pintu' },
  { id: 'v10', themeId: 't3', arabicText: 'نَافِذَة', meaningMs: 'Tingkap' },
  // Warna
  { id: 'v11', themeId: 't4', arabicText: 'أَحْمَر', meaningMs: 'Merah' },
  { id: 'v12', themeId: 't4', arabicText: 'أَخْضَر', meaningMs: 'Hijau' },
  { id: 'v13', themeId: 't4', arabicText: 'أَزْرَق', meaningMs: 'Biru' },
  { id: 'v14', themeId: 't4', arabicText: 'أَصْفَر', meaningMs: 'Kuning' },
  // Masa dan hari
  { id: 'v15', themeId: 't5', arabicText: 'اليَوْم', meaningMs: 'Hari ini' },
  { id: 'v16', themeId: 't5', arabicText: 'غَدًا', meaningMs: 'Esok' },
  { id: 'v17', themeId: 't5', arabicText: 'الأَحَد', meaningMs: 'Ahad' },
  { id: 'v18', themeId: 't5', arabicText: 'الإِثْنَيْن', meaningMs: 'Isnin' },
];

export const activitiesData: Activity[] = [
  // Listening
  { id: 'a1', themeId: 't2', skillType: 'listening', title: 'Dengar dan Pilih', instruction: 'Dengar audio dan pilih perkataan Arab yang betul', questionType: 'choose_word', correctAnswer: 'قَمِيصٌ', choices: ['حِذَاءٌ', 'بِنْطَلُونٌ', 'قَمِيصٌ', 'حِزَامٌ'], arabicText: 'قَمِيْص' },
  { id: 'a2', themeId: 't3', skillType: 'listening', title: 'Dengar dan Pilih', instruction: 'Dengar audio dan pilih perkataan Arab yang betul', questionType: 'choose_word', correctAnswer: 'بَاب', choices: ['بَاب', 'نَافِذَة', 'مَكْتَب', 'سَبُّوْرَة'], arabicText: 'بَاب' },
  // Reading
  { id: 'a3', themeId: 't4', skillType: 'reading', title: 'Baca dan Padankan', instruction: 'Baca dan pilih perkataan Arab yang sepadan', arabicText: 'أَحْمَر', questionType: 'choose_word', correctAnswer: 'أَحْمَرُ', choices: ['أَخْضَرُ', 'أَصْفَرُ', 'أَحْمَرُ', 'أَزْرَقُ'] },
  { id: 'a4', themeId: 't5', skillType: 'reading', title: 'Baca dan Susun', instruction: 'Pilih hari selepas perkataan ini', arabicText: 'الأَحَد', questionType: 'choose_word', correctAnswer: 'الإِثْنَيْنِ', choices: ['الثُّلَاثَاءِ', 'الإِثْنَيْنِ', 'الأَرْبِعَاءِ', 'الخَمِيْسِ'] },
  // Sentences
  { id: 'a5', themeId: 't2', skillType: 'reading', title: 'Ayat Mudah', instruction: 'Pilih perkataan yang betul untuk ayat ini', arabicText: 'هَذَا قَمِيْص', questionType: 'choose_word', correctAnswer: 'هَذَا قَمِيصٌ', choices: ['هَذَا بِنْطَلُونٌ', 'هَذَا قَمِيصٌ', 'ذَلِكَ قَمِيصٌ', 'عِنْدِي قَمِيصٌ'] },
];

// Helper to simulate text-to-speech for arabic since actual audio files aren't provided
export const quizQuestions = [
  {
    id: 1,
    unitKey: "unit_2_clothing",
    quizType: "listening",
    questionText: "Dengar audio dan pilih perkataan Arab yang betul.",
    audioKey: "shoes",
    correctAnswer: "حِذَاءٌ",
    options: ["حِذَاءٌ", "قَمِيصٌ", "بِنْطَلُونٌ", "حِزَامٌ"]
  },
  {
    id: 2,
    unitKey: "unit_2_clothing",
    quizType: "listening",
    questionText: "Dengar audio dan pilih perkataan Arab yang betul.",
    audioKey: "shirt",
    correctAnswer: "قَمِيصٌ",
    options: ["جَوْرَبٌ", "قَمِيصٌ", "خِمَارٌ", "مَنْدِيلٌ"]
  },
  {
    id: 3,
    unitKey: "unit_3_colors",
    quizType: "reading",
    questionText: "Baca perkataan Arab dan pilih warna yang betul.",
    arabicText: "أَحْمَرُ",
    correctAnswer: "red",
    options: [
      { imageKey: "red", colorHex: "#EF4444" },
      { imageKey: "blue", colorHex: "#2563EB" },
      { imageKey: "green", colorHex: "#22C55E" },
      { imageKey: "yellow", colorHex: "#FACC15" }
    ]
  },
  {
    id: 4,
    unitKey: "unit_1_classroom",
    quizType: "reading",
    questionText: "Baca perkataan Arab dan pilih gambar yang betul.",
    arabicText: "كُرْسِيّ",
    correctAnswer: "chair",
    options: [
      { imageKey: "chair" },
      { imageKey: "door" },
      { imageKey: "book" },
      { imageKey: "fan" }
    ]
  }
];

export const playArabicAudio = (text: string) => {
  if (!window.speechSynthesis) return;
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = 'ar-SA';
  window.speechSynthesis.speak(msg);
};
