-- Add feedback_type column to support different types of feedback
ALTER TABLE public.translation_suggestions 
ADD COLUMN feedback_type TEXT NOT NULL DEFAULT 'translation' 
CHECK (feedback_type IN ('translation', 'feature', 'improvement', 'bug', 'other'));

-- Rename table to be more generic
ALTER TABLE public.translation_suggestions RENAME TO user_feedback;

-- Make original_text and language_code optional (not needed for non-translation feedback)
ALTER TABLE public.user_feedback ALTER COLUMN original_text DROP NOT NULL;
ALTER TABLE public.user_feedback ALTER COLUMN language_code DROP NOT NULL;