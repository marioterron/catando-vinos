-- Ensure the is_revealed column has the correct permissions and constraints
ALTER TABLE public.tasting_notes 
ALTER COLUMN is_revealed SET NOT NULL,
ALTER COLUMN is_revealed SET DEFAULT false;

-- Drop existing update policies if they exist
DROP POLICY IF EXISTS "Users can update their own tasting notes" ON public.tasting_notes;
DROP POLICY IF EXISTS "Users can update is_revealed on their own tasting notes" ON public.tasting_notes;

-- Create a single comprehensive update policy
CREATE POLICY "Users can update their own tasting notes"
    ON public.tasting_notes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Ensure proper permissions
GRANT ALL ON public.tasting_notes TO authenticated;

-- Update any existing null values
UPDATE public.tasting_notes 
SET is_revealed = false 
WHERE is_revealed IS NULL;