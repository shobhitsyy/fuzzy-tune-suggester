
-- Add lyric_snippet column to cache a short lyric for each song
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS lyric_snippet TEXT;
