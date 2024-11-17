-- Add DELETE policy for tasting notes
CREATE POLICY "Users can delete their own tasting notes"
    ON public.tasting_notes
    FOR DELETE
    USING (auth.uid() = user_id);