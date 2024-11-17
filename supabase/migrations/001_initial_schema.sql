-- Create tables
CREATE TABLE IF NOT EXISTS public.tasting_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    perceived_price DECIMAL(10,2) NOT NULL,
    flavors TEXT[] NOT NULL DEFAULT '{}',
    comments TEXT,
    wine_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tasting_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tasting notes"
    ON public.tasting_notes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasting notes"
    ON public.tasting_notes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_tasting_notes_user_id ON public.tasting_notes(user_id);
CREATE INDEX idx_tasting_notes_created_at ON public.tasting_notes(created_at);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_tasting_notes_updated_at
    BEFORE UPDATE ON public.tasting_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();