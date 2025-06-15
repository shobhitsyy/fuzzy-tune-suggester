
-- Attach the trigger to the songs table to prevent duplicates
DROP TRIGGER IF EXISTS prevent_duplicates_trigger ON songs;

CREATE TRIGGER prevent_duplicates_trigger
BEFORE INSERT OR UPDATE ON songs
FOR EACH ROW EXECUTE FUNCTION public.prevent_song_duplicates();
