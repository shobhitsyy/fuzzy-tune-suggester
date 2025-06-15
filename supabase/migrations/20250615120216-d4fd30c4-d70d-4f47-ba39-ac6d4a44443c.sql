
-- Insert (A, B) direction
WITH latest_songs AS (
  SELECT id
  FROM songs
  ORDER BY created_at DESC
  LIMIT 9
),
song_pairs AS (
  SELECT a.id AS id1, b.id AS id2
  FROM latest_songs a
  JOIN latest_songs b ON a.id < b.id
)
INSERT INTO song_similarities (id, song_id, similar_song_id, created_at)
SELECT gen_random_uuid(), id1, id2, now() FROM song_pairs
ON CONFLICT DO NOTHING;

-- Insert (B, A) direction
WITH latest_songs AS (
  SELECT id
  FROM songs
  ORDER BY created_at DESC
  LIMIT 9
),
song_pairs AS (
  SELECT a.id AS id1, b.id AS id2
  FROM latest_songs a
  JOIN latest_songs b ON a.id < b.id
)
INSERT INTO song_similarities (id, song_id, similar_song_id, created_at)
SELECT gen_random_uuid(), id2, id1, now() FROM song_pairs
ON CONFLICT DO NOTHING;
