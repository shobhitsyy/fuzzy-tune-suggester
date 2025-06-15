
-- First, drop the old trigger function if it exists.
DROP FUNCTION IF EXISTS public.prevent_song_duplicates CASCADE;

-- Recreate the trigger function using the correct column name: "title"
CREATE OR REPLACE FUNCTION public.prevent_song_duplicates()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM songs 
    WHERE 
      title = NEW.title 
      AND artist = NEW.artist 
      AND language = NEW.language
      AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Duplicate song entry found: % by % in %', NEW.title, NEW.artist, NEW.language;
  END IF;
  RETURN NEW;
END;
$function$;
