
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to clear all similarities and regenerate 3 unique similarities for each song in the db.
 * Should be run ONCE after DB is seeded.
 */
async function clearAndRegenerateAllSimilarities() {
  // 1. Wipe the table
  let { error: delErr } = await supabase.from("song_similarities").delete().neq("id", "");
  if (delErr) {
    console.error("Failed to clear song_similarities:", delErr);
    throw delErr;
  }
  console.log("Cleared all song_similarities.");

  // 2. Fetch all songs
  const { data: songs, error: songsErr } = await supabase
    .from("songs")
    .select("id, category, language");

  if (songsErr || !songs) {
    console.error("Failed to fetch songs:", songsErr);
    throw songsErr;
  }
  console.log(`Fetched ${songs.length} songs`);

  // 3. For each song, select 3 most suitable other songs and insert similarities (bidirectional)
  let allSimilarities: any[] = [];

  for (const song of songs) {
    // Exclude this song
    const others = songs.filter((s) => s.id !== song.id);

    // Priority buckets
    const sameCatLang = others.filter(
      (s) => s.category === song.category && s.language === song.language
    );
    const sameCatDiffLang = others.filter(
      (s) => s.category === song.category && s.language !== song.language
    );
    const sameLangDiffCat = others.filter(
      (s) => s.language === song.language && s.category !== song.category
    );
    const anyOthers = others.filter(
      (s) => s.category !== song.category && s.language !== song.language
    );

    // Shuffle all buckets
    function shuffle(arr: any[]) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [sameCatLang, sameCatDiffLang, sameLangDiffCat, anyOthers].forEach(shuffle);

    // Pick up to 3
    const picks = [
      ...sameCatLang,
      ...sameCatDiffLang,
      ...sameLangDiffCat,
      ...anyOthers,
    ].slice(0, 3);

    // Insert both (A, B) and (B, A)
    for (const pick of picks) {
      allSimilarities.push({
        id: `${song.id}-${pick.id}`,
        song_id: song.id,
        similar_song_id: pick.id,
      });
      allSimilarities.push({
        id: `${pick.id}-${song.id}`,
        song_id: pick.id,
        similar_song_id: song.id,
      });
    }
  }

  console.log(
    `Prepared to insert total of ${allSimilarities.length} similarity records.`
  );

  // Important: Only unique `(song_id, similar_song_id)` combinations
  const unique = new Map();
  allSimilarities.forEach((s) => {
    const key = `${s.song_id}-${s.similar_song_id}`;
    unique.set(key, s);
  });
  const finalSimilarities = Array.from(unique.values());

  // 4. Bulk insert (use chunks to avoid size limits)
  const chunkSize = 500;
  for (let i = 0; i < finalSimilarities.length; i += chunkSize) {
    const chunk = finalSimilarities.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("song_similarities")
      .upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error("Error inserting similarities chunk:", error);
      throw error;
    }
    console.log(`Inserted ${chunk.length} similarities...`);
  }

  console.log(
    "✅ Song similarities regeneration complete. Every song should now have up to 3 unique similar songs."
  );
}

export default clearAndRegenerateAllSimilarities;
