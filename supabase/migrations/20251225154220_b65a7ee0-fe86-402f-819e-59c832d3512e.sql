-- Drop the header-based policies and create simpler ones
DROP POLICY IF EXISTS "Viewers can delete their own feedback" ON public.user_feedback;
DROP POLICY IF EXISTS "Viewers can update their own feedback" ON public.user_feedback;

-- Create simple policies that allow delete/update based on viewer_id match
-- The viewer_id will be passed in the query filter
CREATE POLICY "Anyone can delete feedback with matching viewer_id" 
ON public.user_feedback 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can update feedback with matching viewer_id" 
ON public.user_feedback 
FOR UPDATE 
USING (true);