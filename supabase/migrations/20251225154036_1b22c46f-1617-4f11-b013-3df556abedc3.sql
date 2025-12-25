-- Add viewer_id column to track who submitted the feedback
ALTER TABLE public.user_feedback ADD COLUMN viewer_id TEXT;

-- Drop existing delete policy
DROP POLICY IF EXISTS "Anyone can delete feedback" ON public.user_feedback;

-- Create policy for viewers to delete their own feedback
CREATE POLICY "Viewers can delete their own feedback" 
ON public.user_feedback 
FOR DELETE 
USING (viewer_id IS NOT NULL AND viewer_id = current_setting('request.headers', true)::json->>'x-viewer-id');

-- Create policy for viewers to update their own feedback
CREATE POLICY "Viewers can update their own feedback" 
ON public.user_feedback 
FOR UPDATE 
USING (viewer_id IS NOT NULL AND viewer_id = current_setting('request.headers', true)::json->>'x-viewer-id');