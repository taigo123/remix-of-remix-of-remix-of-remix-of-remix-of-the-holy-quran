-- Allow anyone to delete feedback (for admin purposes)
CREATE POLICY "Anyone can delete feedback" 
ON public.user_feedback 
FOR DELETE 
USING (true);