-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- جدول لتتبع إحصائيات الزوار
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- جدول لتتبع الزيارات الفردية
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_path TEXT DEFAULT '/'
);

-- Enable RLS
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Allow public read access for visitor stats
CREATE POLICY "Anyone can view visitor stats" 
ON public.visitor_stats 
FOR SELECT 
USING (true);

-- Allow public insert for visits tracking
CREATE POLICY "Anyone can add visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (true);

-- Allow public read for visits (to check if visitor exists)
CREATE POLICY "Anyone can read visits" 
ON public.visits 
FOR SELECT 
USING (true);

-- Function to update visitor stats
CREATE OR REPLACE FUNCTION public.record_visit(p_visitor_id TEXT, p_page_path TEXT DEFAULT '/')
RETURNS void AS $$
DECLARE
  v_is_new_visitor BOOLEAN;
BEGIN
  -- Check if this is a new visitor today
  SELECT NOT EXISTS (
    SELECT 1 FROM public.visits 
    WHERE visitor_id = p_visitor_id 
    AND visited_at::date = CURRENT_DATE
  ) INTO v_is_new_visitor;

  -- Insert the visit
  INSERT INTO public.visits (visitor_id, page_path)
  VALUES (p_visitor_id, p_page_path);

  -- Update or insert daily stats
  INSERT INTO public.visitor_stats (date, total_visits, unique_visitors)
  VALUES (CURRENT_DATE, 1, CASE WHEN v_is_new_visitor THEN 1 ELSE 0 END)
  ON CONFLICT (date) DO UPDATE SET
    total_visits = visitor_stats.total_visits + 1,
    unique_visitors = visitor_stats.unique_visitors + CASE WHEN v_is_new_visitor THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visitor_stats_updated_at
BEFORE UPDATE ON public.visitor_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();