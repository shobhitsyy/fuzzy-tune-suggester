
-- Remove duplicates from the songs table, keeping the most recent created_at (or lowest id if necessary)
DELETE FROM songs a
USING songs b
WHERE
  a.id < b.id
  AND LOWER(a.title) = LOWER(b.title)
  AND LOWER(a.artist) = LOWER(b.artist)
  AND LOWER(a.language) = LOWER(b.language);

-- Drop the song_similarities table
DROP TABLE IF EXISTS song_similarities;
