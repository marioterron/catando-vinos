-- Add is_revealed column to tasting_notes table
ALTER TABLE public.tasting_notes 
ADD COLUMN is_revealed BOOLEAN NOT NULL DEFAULT FALSE;