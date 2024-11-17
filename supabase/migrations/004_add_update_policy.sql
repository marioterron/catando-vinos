-- Add UPDATE policy for tasting notes
CREATE POLICY "Users can update their own tasting notes"
    ON public.tasting_notes
    FOR UPDATE
    USING (auth.uid() = user_id);