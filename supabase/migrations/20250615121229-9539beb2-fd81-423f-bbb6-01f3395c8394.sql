
-- Identify all songs that don't have any entries in song_similarities as song_id
WITH missing_similarities AS (
  SELECT id
  FROM songs
  WHERE id NOT IN (
    SELECT DISTINCT song_id FROM song_similarities WHERE song_id IS NOT NULL
  )
),
song_pairs AS (
  SELECT a.id AS id1, b.id AS id2
  FROM missing_similarities a
  JOIN missing_similarities b ON a.id < b.id
)
-- Insert (A, B) direction
INSERT INTO song_similarities (id, song_id, similar_song_id, created_at)
SELECT gen_random_uuid(), id1, id2, now()
FROM song_pairs
ON CONFLICT DO NOTHING;

-- Insert (B, A) direction
WITH missing_similarities AS (
  SELECT id
  FROM songs
  WHERE id NOT IN (
    SELECT DISTINCT song_id FROM song_similarities WHERE song_id IS NOT NULL
  )
),
song_pairs AS (
  SELECT a.id AS id1, b.id AS id2
  FROM missing_similarities a
  JOIN missing_similarities b ON a.id < b.id
)
INSERT INTO song_similarities (id, song_id, similar_song_id, created_at)
SELECT gen_random_uuid(), id2, id1, now()
FROM song_pairs
ON CONFLICT DO NOTHING;
