-- Schema for E-Kalam / e-كلام

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: curriculum_standards
CREATE TABLE IF NOT EXISTS curriculum_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_type VARCHAR(50) NOT NULL, -- 'listening', 'reading'
    standard_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    year_level INTEGER DEFAULT 3,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: learning_themes
CREATE TABLE IF NOT EXISTS learning_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: vocabulary_items
CREATE TABLE IF NOT EXISTS vocabulary_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES learning_themes(id) ON DELETE CASCADE,
    arabic_text VARCHAR(255) NOT NULL,
    meaning_ms VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    audio_url TEXT,
    image_url TEXT,
    difficulty INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: phrase_items
CREATE TABLE IF NOT EXISTS phrase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES learning_themes(id) ON DELETE CASCADE,
    arabic_text TEXT NOT NULL,
    meaning_ms TEXT NOT NULL,
    usage_context TEXT,
    audio_url TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: letter_focus
CREATE TABLE IF NOT EXISTS letter_focus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    arabic_letter VARCHAR(10) NOT NULL,
    sound_note TEXT,
    example_word VARCHAR(100),
    example_meaning VARCHAR(100),
    audio_url TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: number_items
CREATE TABLE IF NOT EXISTS number_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number_value INTEGER NOT NULL,
    arabic_number VARCHAR(20) NOT NULL,
    arabic_word VARCHAR(100) NOT NULL,
    meaning_ms VARCHAR(100) NOT NULL,
    audio_url TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: listening_activities
CREATE TABLE IF NOT EXISTS listening_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES learning_themes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instruction TEXT,
    audio_url TEXT,
    question_type VARCHAR(100), -- 'choose_image', 'choose_word', 'choose_meaning', 'order'
    correct_answer TEXT NOT NULL,
    choices_json JSONB,
    difficulty INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: reading_activities
CREATE TABLE IF NOT EXISTS reading_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES learning_themes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    instruction TEXT,
    arabic_text TEXT NOT NULL,
    question_type VARCHAR(100), -- 'choose_image', 'choose_meaning', 'match'
    correct_answer TEXT NOT NULL,
    choices_json JSONB,
    difficulty INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: quiz_questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theme_id UUID REFERENCES learning_themes(id) ON DELETE CASCADE,
    skill_type VARCHAR(50) NOT NULL, -- 'listening', 'reading'
    question TEXT NOT NULL,
    question_arabic TEXT,
    audio_url TEXT,
    image_url TEXT,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    correct_answer CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation_ms TEXT,
    difficulty INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users(id)
    completed_listening_activity_ids UUID[] DEFAULT '{}',
    completed_reading_activity_ids UUID[] DEFAULT '{}',
    completed_theme_ids UUID[] DEFAULT '{}',
    listening_score INTEGER DEFAULT 0,
    reading_score INTEGER DEFAULT 0,
    quiz_score INTEGER DEFAULT 0,
    tp_level_estimate INTEGER DEFAULT 1,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Table: user_attempts
CREATE TABLE IF NOT EXISTS user_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    activity_type VARCHAR(50), -- 'listening', 'reading', 'quiz'
    activity_id UUID NOT NULL,
    answer_json JSONB,
    score INTEGER DEFAULT 0,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ai_knowledge_chunks (Requires pgvector for embedding, but assuming basic text for now)
CREATE TABLE IF NOT EXISTS ai_knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    theme VARCHAR(100),
    skill_type VARCHAR(50),
    source_reference TEXT,
    -- embedding vector(1536), -- Uncomment if pgvector is enabled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: admin_profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
CREATE POLICY "Users can view their own progress" ON user_progress FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
CREATE POLICY "Users can update their own progress" ON user_progress FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
CREATE POLICY "Users can insert their own progress" ON user_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies for user_attempts
DROP POLICY IF EXISTS "Users can view their own attempts" ON user_attempts;
CREATE POLICY "Users can view their own attempts" ON user_attempts FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own attempts" ON user_attempts;
CREATE POLICY "Users can insert their own attempts" ON user_attempts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Table: unit_vocabulary
CREATE TABLE IF NOT EXISTS public.unit_vocabulary (
  id uuid primary key default gen_random_uuid(),
  unit_key text not null,
  arabic_text text not null,
  meaning_ms text,
  image_key text,
  image_url text,
  audio_url text,
  color_hex text,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Policies for unit_vocabulary
ALTER TABLE public.unit_vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read unit vocabulary" ON unit_vocabulary;
CREATE POLICY "public can read unit vocabulary" ON public.unit_vocabulary
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "admin can insert unit vocabulary" ON unit_vocabulary;
CREATE POLICY "admin can insert unit vocabulary" ON public.unit_vocabulary
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admin can update unit vocabulary" ON unit_vocabulary;
CREATE POLICY "admin can update unit vocabulary" ON public.unit_vocabulary
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admin can delete unit vocabulary" ON unit_vocabulary;
CREATE POLICY "admin can delete unit vocabulary" ON public.unit_vocabulary
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

-- Seed data for Unit 1
INSERT INTO public.unit_vocabulary (unit_key, arabic_text, meaning_ms, image_key, order_index)
VALUES
('unit_1_classroom', 'كُرْسِيّ', 'Kerusi', 'chair', 1),
('unit_1_classroom', 'بَاب', 'Pintu', 'door', 2),
('unit_1_classroom', 'مَكْتَب', 'Meja', 'desk', 3),
('unit_1_classroom', 'دُولَاب', 'Almari', 'cupboard', 4),
('unit_1_classroom', 'مِصْبَاح', 'Lampu', 'lamp', 5),
('unit_1_classroom', 'نَافِذَة', 'Tingkap', 'window', 6),
('unit_1_classroom', 'لَوْحَة', 'Papan', 'board', 7),
('unit_1_classroom', 'مِرْوَحَة', 'Kipas', 'fan', 8),
('unit_1_classroom', 'مُمْسَحَة', 'Pemadam papan', 'eraser', 9),
('unit_1_classroom', 'سَبُّورَة', 'Papan tulis', 'whiteboard', 10),
('unit_1_classroom', 'مِكْنَسَة', 'Penyapu', 'broom', 11),
('unit_1_classroom', 'سَلَّة', 'Bakul / tong sampah', 'basket', 12),
('unit_1_classroom', 'كِتَاب', 'Buku', 'book', 13)
ON CONFLICT DO NOTHING;

-- Seed data for Unit 2
INSERT INTO public.unit_vocabulary (unit_key, arabic_text, meaning_ms, image_key, order_index)
VALUES
('unit_2_clothing', 'نَظَّارَةٌ', 'Cermin mata', 'glasses', 1),
('unit_2_clothing', 'قَمِيصٌ', 'Kemeja / baju', 'shirt', 2),
('unit_2_clothing', 'بَنْطَلُونٌ', 'Seluar panjang', 'pants', 3),
('unit_2_clothing', 'رَبْطَةُ العُنُقِ', 'Tali leher', 'tie', 4),
('unit_2_clothing', 'حِزَامٌ', 'Tali pinggang', 'belt', 5),
('unit_2_clothing', 'فُسْتَانٌ', 'Gaun', 'dress', 6),
('unit_2_clothing', 'خِمَارٌ', 'Tudung', 'hijab', 7),
('unit_2_clothing', 'مَنْدِيلٌ', 'Sapu tangan', 'handkerchief', 8),
('unit_2_clothing', 'مِحْفَظَةٌ', 'Dompet', 'wallet', 9),
('unit_2_clothing', 'جَوْرَبٌ', 'Stoking', 'socks', 10),
('unit_2_clothing', 'حِذَاءٌ', 'Kasut', 'shoes', 11)
ON CONFLICT DO NOTHING;

-- Fix for handbag to wallet
UPDATE public.unit_vocabulary
SET
  meaning_ms = 'Dompet',
  image_key = 'wallet'
WHERE
  unit_key = 'unit_2_clothing'
  AND arabic_text = 'مِحْفَظَةٌ';

-- Fixes for Unit 2 specific vocabularies
UPDATE public.unit_vocabulary
SET
  meaning_ms = 'Tali leher',
  image_key = 'tie',
  image_url = null
WHERE
  unit_key = 'unit_2_clothing'
  AND arabic_text = 'رَبْطَةُ العُنُقِ';

UPDATE public.unit_vocabulary
SET
  meaning_ms = 'Tali pinggang',
  image_key = 'belt',
  image_url = null
WHERE
  unit_key = 'unit_2_clothing'
  AND arabic_text = 'حِزَامٌ';

UPDATE public.unit_vocabulary
SET
  meaning_ms = 'Sapu tangan',
  image_key = 'handkerchief',
  image_url = null
WHERE
  unit_key = 'unit_2_clothing'
  AND arabic_text = 'مَنْدِيلٌ';

-- Seed data for Unit 3
INSERT INTO public.unit_vocabulary
(unit_key, arabic_text, meaning_ms, image_key, color_hex, order_index)
VALUES
('unit_3_colors', 'أَحْمَرُ', 'Merah', 'red', '#EF4444', 1),
('unit_3_colors', 'أَزْرَقُ', 'Biru', 'blue', '#2563EB', 2),
('unit_3_colors', 'أَبْيَضُ', 'Putih', 'white', '#FFFFFF', 3),
('unit_3_colors', 'أَخْضَرُ', 'Hijau', 'green', '#22C55E', 4),
('unit_3_colors', 'أَسْوَدُ', 'Hitam', 'black', '#111827', 5),
('unit_3_colors', 'أَصْفَرُ', 'Kuning', 'yellow', '#FACC15', 6),
('unit_3_colors', 'بُرْتُقَالِيٌّ', 'Oren', 'orange', '#F97316', 7),
('unit_3_colors', 'رَمَادِيٌّ', 'Kelabu', 'gray', '#9CA3AF', 8),
('unit_3_colors', 'وَرْدِيٌّ', 'Merah jambu', 'pink', '#F472B6', 9),
('unit_3_colors', 'بُنِّيٌّ', 'Coklat', 'brown', '#92400E', 10),
('unit_3_colors', 'بَنَفْسَجِيٌّ', 'Ungu', 'purple', '#8B5CF6', 11)
ON CONFLICT DO NOTHING;

-- Seed data for Unit 4
INSERT INTO public.unit_vocabulary
(unit_key, arabic_text, meaning_ms, image_key, order_index)
VALUES
('unit_4_time', 'الْيَوْمَ', 'Hari ini', 'today', 1),
('unit_4_time', 'غَدًا', 'Esok', 'tomorrow', 2),
('unit_4_time', 'أَمْسِ', 'Semalam', 'yesterday', 3),
('unit_4_time', 'صَبَاحٌ', 'Pagi', 'morning', 4),
('unit_4_time', 'ظُهْرٌ', 'Tengah hari', 'noon', 5),
('unit_4_time', 'مَسَاءٌ', 'Petang / malam', 'evening', 6),
('unit_4_time', 'الْإِثْنَيْنِ', 'Isnin', 'monday', 7),
('unit_4_time', 'الثُّلَاثَاءِ', 'Selasa', 'tuesday', 8),
('unit_4_time', 'الْأَرْبِعَاءِ', 'Rabu', 'wednesday', 9),
('unit_4_time', 'الْخَمِيسِ', 'Khamis', 'thursday', 10),
('unit_4_time', 'الْجُمُعَةِ', 'Jumaat', 'friday', 11),
('unit_4_time', 'السَّبْتِ', 'Sabtu', 'saturday', 12),
('unit_4_time', 'الْأَحَدِ', 'Ahad', 'sunday', 13)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_type text not null,
  unit_key text,
  score int not null default 0,
  total_questions int not null default 0,
  correct_answers int not null default 0,
  stars int not null default 0,
  badge text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own quiz attempts" ON quiz_attempts;
CREATE POLICY "users can read own quiz attempts" ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users can insert own quiz attempts" ON quiz_attempts;
CREATE POLICY "users can insert own quiz attempts" ON public.quiz_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.app_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  title text not null,
  description text,
  file_path text,
  public_url text,
  asset_type text not null default 'avatar',
  updated_by uuid, -- References auth.users(id)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Policies for app_assets
ALTER TABLE public.app_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read app assets" ON app_assets;
CREATE POLICY "public can read app assets" ON public.app_assets
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "admin can insert app assets" ON app_assets;
CREATE POLICY "admin can insert app assets" ON public.app_assets
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admin can update app assets" ON app_assets;
CREATE POLICY "admin can update app assets" ON public.app_assets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admin can delete app assets" ON app_assets;
CREATE POLICY "admin can delete app assets" ON public.app_assets
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_profiles
    WHERE admin_profiles.user_id = auth.uid()
  )
);

-- Storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('e-kalam-assets', 'e-kalam-assets', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access e-kalam-assets" ON storage.objects;
CREATE POLICY "Public Access e-kalam-assets" ON storage.objects FOR SELECT USING (bucket_id = 'e-kalam-assets');

DROP POLICY IF EXISTS "Admin Manage e-kalam-assets" ON storage.objects;
CREATE POLICY "Admin Manage e-kalam-assets" ON storage.objects USING (bucket_id = 'e-kalam-assets') WITH CHECK (bucket_id = 'e-kalam-assets');
