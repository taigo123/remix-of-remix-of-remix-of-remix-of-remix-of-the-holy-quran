-- Create table for translation suggestions
CREATE TABLE public.translation_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT NOT NULL,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  context TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.translation_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert suggestions (no auth required for feedback)
CREATE POLICY "Anyone can submit translation suggestions"
ON public.translation_suggestions
FOR INSERT
WITH CHECK (true);

-- Only allow reading own suggestions or public viewing for transparency
CREATE POLICY "Anyone can view suggestions"
ON public.translation_suggestions
FOR SELECT
USING (true);