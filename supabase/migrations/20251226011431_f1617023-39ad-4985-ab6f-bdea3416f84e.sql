-- جدول لتتبع التلاوات المكتملة
CREATE TABLE public.recitation_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_recitations INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT recitation_stats_date_key UNIQUE (date)
);

-- تفعيل RLS
ALTER TABLE public.recitation_stats ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة للجميع
CREATE POLICY "Anyone can view recitation stats" 
ON public.recitation_stats 
FOR SELECT 
USING (true);

-- جدول لتتبع كل تلاوة
CREATE TABLE public.recitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  surah_id INTEGER NOT NULL,
  verse_start INTEGER,
  verse_end INTEGER,
  reciter TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.recitations ENABLE ROW LEVEL SECURITY;

-- سياسة إضافة التلاوات
CREATE POLICY "Anyone can add recitations" 
ON public.recitations 
FOR INSERT 
WITH CHECK (true);

-- سياسة قراءة التلاوات
CREATE POLICY "Anyone can read recitations" 
ON public.recitations 
FOR SELECT 
USING (true);

-- دالة لتسجيل التلاوة المكتملة
CREATE OR REPLACE FUNCTION public.record_recitation(
  p_visitor_id TEXT,
  p_surah_id INTEGER,
  p_verse_start INTEGER DEFAULT NULL,
  p_verse_end INTEGER DEFAULT NULL,
  p_reciter TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert the recitation
  INSERT INTO public.recitations (visitor_id, surah_id, verse_start, verse_end, reciter)
  VALUES (p_visitor_id, p_surah_id, p_verse_start, p_verse_end, p_reciter);

  -- Update or insert daily stats
  INSERT INTO public.recitation_stats (date, total_recitations)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (date) DO UPDATE SET
    total_recitations = recitation_stats.total_recitations + 1,
    updated_at = now();
END;
$$;

-- Trigger لتحديث updated_at
CREATE TRIGGER update_recitation_stats_updated_at
BEFORE UPDATE ON public.recitation_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();