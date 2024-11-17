-- Ensure is_revealed column exists and has correct permissions
ALTER TABLE IF EXISTS public.tasting_notes 
ALTER COLUMN is_revealed SET DEFAULT false;

-- Add UPDATE policy for is_revealed
CREATE POLICY "Users can update is_revealed on their own tasting notes"
    ON public.tasting_notes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant UPDATE permissions on is_revealed column
GRANT UPDATE(is_revealed) ON public.tasting_notes TO authenticated;

-- Update existing rows to have is_revealed = false if null
UPDATE public.tasting_notes 
SET is_revealed = false 
WHERE is_revealed IS NULL;